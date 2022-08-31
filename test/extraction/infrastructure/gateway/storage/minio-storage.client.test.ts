import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { Client } from "minio";
import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { Configuration } from "@configuration/configuration";
import { EcritureFluxErreur } from "@extraction/domain/storage.client";
import { FileSystemClient } from "@extraction/infrastructure/gateway/common/node-file-system.client";
import { MinioStorageClient } from "@extraction/infrastructure/gateway/storage/minio-storage.client";
import { UuidGenerator } from "@extraction/infrastructure/gateway/common/uuid.generator";

const localFileNameIncludingPath = "./tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";
const fluxName = "fluxName";
let fileContent: string;
let fileNameIncludingPath: string;
let configuration: StubbedType<Configuration>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let storageClient: MinioStorageClient;

describe("MinioStorageClientTest", () => {
	beforeEach(() => {
		fileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
		fileContent = "<toto>contenu du fichier</toto>\n";

		minioStub = stubClass(Client);

		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO_RAW_BUCKET_NAME = "raw";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";

		fileSystemClient = stubInterface<FileSystemClient>(sinon);

		uuidClient = stubInterface<UuidGenerator>(sinon);
		uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");

		storageClient = new MinioStorageClient(
			configuration,
			minioStub,
			fileSystemClient,
			uuidClient
		);
	});

	context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
		it("j'écris le contenu d'un fichier", async () => {
			await storageClient.enregistrer(fileNameIncludingPath, fileContent, fluxName);

			expect(uuidClient.generate).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledWith(localFileNameIncludingPath, fileContent);
			expect(minioStub.fPutObject).to.have.been.calledOnce;
			expect(minioStub.fPutObject).to.have.been.calledWith(
				configuration.MINIO_RAW_BUCKET_NAME,
				fileNameIncludingPath,
				localFileNameIncludingPath
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque j'écris le contenu d'un fichier compressé qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
		beforeEach(() => {
			fileNameIncludingPath = fileNameIncludingPath.concat(".gz");
		});

		it("j'écris le contenu d'un fichier", async () => {
			await storageClient.enregistrer(fileNameIncludingPath, fileContent, fluxName);

			expect(uuidClient.generate).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledWith(localFileNameIncludingPath, fileContent);
			expect(minioStub.fPutObject).to.have.been.calledOnce;
			expect(minioStub.fPutObject).to.have.been.calledWith(
				configuration.MINIO_RAW_BUCKET_NAME,
				fileNameIncludingPath.replace(".gz", ""),
				localFileNameIncludingPath
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque je n'arrive pas à écrire le fichier chez moi", () => {
		beforeEach(() => {
			fileSystemClient.write.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(storageClient.enregistrer(fileNameIncludingPath, fileContent, fluxName)).to.be.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${fluxName} n'a pas été extrait car une erreur d'écriture est survenue`
			);
		});
	});

	context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
		" fichier est invalide", () => {
		beforeEach(() => {
			minioStub.fPutObject.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(storageClient.enregistrer(fileNameIncludingPath, fileContent, fluxName)).to.be.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${fluxName} n'a pas été extrait car une erreur d'écriture est survenue`
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});
});
