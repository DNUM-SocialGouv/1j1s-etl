import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { Client } from "minio";
import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { Configuration } from "@configuration/configuration";
import {
	ContentParser,
} from "@transformation/infrastructure/gateway/xml-content.parser";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/gateway/storage.repository";
import { FileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { MinioStorageRepository } from "@transformation/infrastructure/gateway/repository/minio-storage.repository";
import { UuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";

const fluxName = "fluxName";
let localFileNameIncludingPath = "./tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";
let fileContent: string;
let fileNameIncludingPath: string;
let latestStoredFileNameIncludingPath: string;

let configuration: StubbedType<Configuration>;
let contentParserRepository: StubbedType<ContentParser>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let storageClient: MinioStorageRepository;

describe("MinioStorageClientTest", () => {
	beforeEach(() => {
		fileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
		fileContent = "<toto>contenu du fichier</toto>";

		minioStub = stubClass(Client);
		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO_RAW_BUCKET_NAME = "raw";
		configuration.MINIO_TRANSFORMED_BUCKET_NAME = "json";
		contentParserRepository = stubInterface<ContentParser>(sinon);
		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		uuidClient = stubInterface<UuidGenerator>(sinon);
		uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");
		storageClient = new MinioStorageRepository(
			configuration,
			minioStub,
			fileSystemClient,
			uuidClient,
			contentParserRepository,
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
				configuration.MINIO_TRANSFORMED_BUCKET_NAME,
				fileNameIncludingPath,
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

	context("Lorsque je récupère le contenu d'un fichier", () => {
		beforeEach(() => {
			latestStoredFileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
			configuration = stubInterface<Configuration>(sinon);
			configuration.MINIO_RAW_BUCKET_NAME = "raw";

			uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
			localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

			minioStub.fGetObject.resolves();
			fileContent = "<root><title>Titre offre de stage</title><description>Description offre de stage</description></root>";
			fileSystemClient.read.resolves(fileContent);
			contentParserRepository.parse.resolves({
				root: {
					title: "Titre offre de stage",
					description: "Description offre de stage",
				},
			});
		});

		it("je récupère le contenu du fichier", async () => {
			const result = await storageClient.recupererContenu(fileNameIncludingPath);

			expect(result).to.eql({
				root: {
					title: "Titre offre de stage",
					description: "Description offre de stage",
				},
			});
			expect(uuidClient.generate).to.have.been.calledOnce;
			expect(minioStub.fGetObject).to.have.been.calledOnce;
			expect(minioStub.fGetObject).to.have.been.calledWith(
				configuration.MINIO_RAW_BUCKET_NAME,
				latestStoredFileNameIncludingPath,
				localFileNameIncludingPath
			);
			expect(fileSystemClient.read).to.have.been.calledOnce;
			expect(fileSystemClient.read).to.have.been.calledWith(localFileNameIncludingPath);
			expect(contentParserRepository.parse).to.have.been.calledOnce;
			expect(contentParserRepository.parse).to.have.been.calledWith(fileContent);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque je récupère le contenu d'un fichier qui n'existe pas", () => {
		beforeEach(() => {
			latestStoredFileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
			configuration = stubInterface<Configuration>(sinon);
			configuration.MINIO_RAW_BUCKET_NAME = "raw";

			uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
			localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

			minioStub.fGetObject.rejects(new Error("Oops! Something went wrong !"));
		});

		it("je lance une erreur de lecture", async () => {
			await expect(storageClient.recupererContenu(fileNameIncludingPath)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu"
			);
		});
	});

	context("Lorsque je ne réussis pas à lire le contenu d'un fichier", () => {
		beforeEach(() => {
			latestStoredFileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
			configuration = stubInterface<Configuration>(sinon);
			configuration.MINIO_RAW_BUCKET_NAME = "raw";

			uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
			localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

			minioStub.fGetObject.resolves();
			contentParserRepository.parse.rejects(new Error("Oops! Something went wrong !"));
		});

		it("je lance une erreur de lecture", async () => {
			await expect(storageClient.recupererContenu(fileNameIncludingPath)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu"
			);
		});
	});
});
