import { expect } from "chai";
import { Client } from "minio";

import { sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { Configuration } from "@logements/src/chargement/infrastructure/configuration/configuration";
import {
	EcritureFluxErreur,
	LectureFluxErreur,
	MinioStorageClient,
	StorageClient,
} from "@logements/src/chargement/infrastructure/gateway/client/storage.client";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/chargement/fixture/annonce-de-logement.fixture-builder";
import { ConfigurationFixtureBuilder } from "@logements/test/chargement/fixture/configuration.fixture";

import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

let fileSystemClient: StubbedType<FileSystemClient>;
let uuidClient: StubbedType<UuidGenerator>;
let storageClient: StorageClient;

describe("StorageClientTest", () => {
    context("Lorsque je souhaite communiquer avec mon dépot de stockage distant", () => {
        it("j'écris sur mon répertoire distant", async () => {
            //given
            const filepath = "/tmp";
            const minioClient: StubbedClass<Client> = stubClass(Client);
            const configuration: Configuration = ConfigurationFixtureBuilder.build();
            fileSystemClient = stubInterface<FileSystemClient>(sinon);
            uuidClient = stubInterface<UuidGenerator>(sinon);
            storageClient = new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidClient);
            uuidClient.generate.returns("un-uuid");
            const nameFile = "un-uuid";

            //when
            await storageClient.ecrire(filepath, "C'est beau la vie", configuration.IMMOJEUNE.NAME);

            //then
            expect(fileSystemClient.write).to.have.been.calledOnceWith(
                configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile),
                "C'est beau la vie"
            );
            expect(minioClient.fPutObject).to.have.been.calledOnceWith(
                configuration.MINIO.RESULT_BUCKET_NAME,
                filepath,
                configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile)
            );

            expect(fileSystemClient.delete).to.have.been.calledOnceWith(
                configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile)
            );
        });

        it("je peux lire le contenu", async () => {
            const filepath = "/tmp/latest.json";
            const minioClient: StubbedClass<Client> = stubClass(Client);
            const configuration: Configuration = ConfigurationFixtureBuilder.build();
            const nameFile = "uuid";
            const flowName = "immojeune";
            fileSystemClient = stubInterface<FileSystemClient>(sinon);
            uuidClient = stubInterface<UuidGenerator>(sinon);
            storageClient = new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidClient);
            uuidClient.generate.returns("uuid");
            fileSystemClient.read.resolves(JSON.stringify([AnnonceDeLogementFixtureBuilder.build()]));

            const result = await storageClient.lire(filepath, flowName);

            expect(uuidClient.generate).to.have.been.calledOnce;
            expect(minioClient.fGetObject).to.have.been.calledOnceWith(
                configuration.MINIO.TRANSFORMED_BUCKET_NAME,
                filepath,
                configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile)
            );
            expect(fileSystemClient.read).to.have.been.calledOnceWith(
                configuration.TEMPORARY_DIRECTORY_PATH.concat(nameFile)
            );
            expect(result).to.have.deep.members([
                AnnonceDeLogementFixtureBuilder.build(),
            ]);
        });
    });

    context("Lorsque je souhaite communiquer avec mon dépôt distant et qu'une erreur survient", () => {
        it("et que l'écriture échoue, je renvoie une erreur", async () => {
            const minioClient: StubbedClass<Client> = stubClass(Client);
            const configuration: Configuration = ConfigurationFixtureBuilder.build();
            fileSystemClient = stubInterface<FileSystemClient>(sinon);
            uuidClient = stubInterface<UuidGenerator>(sinon);
            storageClient = new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidClient);

            fileSystemClient.write.rejects(new Error("ça à foiré quelque part"));

            await expect(storageClient.ecrire("", "", configuration.IMMOJEUNE.NAME)).to.be.rejectedWith(
                EcritureFluxErreur,
                "An error occurred while writing the flow : ".concat(configuration.IMMOJEUNE.NAME)
            );
        });

        it("et que la lecture échoue, je renvoie une erreur", async () => {
            const minioClient: StubbedClass<Client> = stubClass(Client);
            const configuration: Configuration = ConfigurationFixtureBuilder.build();
            fileSystemClient = stubInterface<FileSystemClient>(sinon);
            uuidClient = stubInterface<UuidGenerator>(sinon);
            storageClient = new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidClient);

            fileSystemClient.read.rejects(new Error("ça à foiré quelque part"));

            await expect(storageClient.lire("", configuration.IMMOJEUNE.NAME)).to.be.rejectedWith(
                LectureFluxErreur,
                "An error occurred while reading the flow : ".concat(configuration.IMMOJEUNE.NAME)
            );
        });
    });
});
