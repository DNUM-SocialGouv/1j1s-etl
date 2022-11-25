import { Client } from "minio";
import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { Configuration } from "@stages/transformation/configuration/configuration";
import { ContentParser } from "@shared/infrastructure/gateway/content.parser";
import { DateService } from "@shared/date.service";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { FileSystemClient } from "@shared/infrastructure/gateway/node-file-system.client";
import { FluxTransformation } from "@stages/transformation/domain/flux";
import { Logger, LoggerStrategy } from "@shared/configuration/logger";
import {
	MinioOffreDeStageRepository,
} from "@stages/transformation/infrastructure/gateway/repository/minio-offre-de-stage.repository";
import { OffreDeStageFixtureBuilder } from "@test/stages/transformation/fixture/offre-de-stage.fixture-builder";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";
import { UuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";

let localFileNameIncludingPath = "./tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";
let offresDeStage: Array<UnJeune1Solution.OffreDeStage>;
let fileContent: string;
let latestFileNameIncludingPath: string;
let historyFileNameIncludingPath: string;

let configuration: StubbedType<Configuration>;
let contentParserRepository: StubbedType<ContentParser>;
let fileSystemClient: StubbedType<FileSystemClient>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let flux: FluxTransformation;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let dateService: StubbedClass<DateService>;
let minioOffreDeStageRepository: MinioOffreDeStageRepository;

describe("MinioOffreDeStageRepositoryTest", () => {
	beforeEach(() => {
		latestFileNameIncludingPath = "source/latest.json";
		historyFileNameIncludingPath = "source/history/2022-01-01T00:00:00.000Z.json";
		fileContent = "<toto>contenu du fichier</toto>";
		flux = new FluxTransformation("source", "history", ".xml", ".json");

		offresDeStage = [OffreDeStageFixtureBuilder.build()];

		minioStub = stubClass(Client);

		loggerStrategy = stubInterface<LoggerStrategy>(sinon);
		logger = stubInterface<Logger>(sinon);
		loggerStrategy.get.returns(logger);

		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.RAW_BUCKET_NAME = "raw";
		configuration.MINIO.TRANSFORMED_BUCKET_NAME = "json";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";

		contentParserRepository = stubInterface<ContentParser>(sinon);
		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		uuidClient = stubInterface<UuidGenerator>(sinon);
		dateService = stubClass(DateService);
		dateService.maintenant.returns(new Date("2022-01-01T00:00:00.000Z"));

		uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");
		minioOffreDeStageRepository = new MinioOffreDeStageRepository(
			configuration,
			minioStub,
			fileSystemClient,
			uuidClient,
			contentParserRepository,
			dateService,
			loggerStrategy,
		);
	});

	context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
		it("j'écris le contenu d'un fichier", async () => {
			await minioOffreDeStageRepository.sauvegarder(offresDeStage, flux);

			expect(uuidClient.generate).to.have.been.calledOnce;

			expect(fileSystemClient.write).to.have.been.calledOnce;
			expect(fileSystemClient.write.getCall(0).args[0]).to.eql(localFileNameIncludingPath);
			expect(JSON.parse(fileSystemClient.write.getCall(0).args[1] as string)).to.have.deep.members(offresDeStage);

			expect(minioStub.fPutObject).to.have.been.calledTwice;
			expect(minioStub.fPutObject.firstCall.args).to.have.deep.members([
				configuration.MINIO.TRANSFORMED_BUCKET_NAME,
				historyFileNameIncludingPath,
				localFileNameIncludingPath,
			]);
			expect(minioStub.fPutObject.secondCall.args).to.have.deep.members([
				configuration.MINIO.TRANSFORMED_BUCKET_NAME,
				latestFileNameIncludingPath,
				localFileNameIncludingPath,
			]);

			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque je n'arrive pas à écrire le fichier chez moi", () => {
		beforeEach(() => {
			fileSystemClient.write.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(minioOffreDeStageRepository.sauvegarder(offresDeStage, flux)).to.be.rejectedWith(
				EcritureFluxErreur,
				"Le flux source n'a pas été extrait car une erreur d'écriture est survenue",
			);
		});
	});

	context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
		" fichier est invalide", () => {
		beforeEach(() => {
			minioStub.fPutObject.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(minioOffreDeStageRepository.sauvegarder(offresDeStage, flux)).to.be.rejectedWith(
				EcritureFluxErreur,
				"Le flux source n'a pas été extrait car une erreur d'écriture est survenue",
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});

	context("Lorsque je récupère le contenu d'un fichier", () => {
		beforeEach(() => {
			configuration = stubInterface<Configuration>(sinon);
			configuration.MINIO.RAW_BUCKET_NAME = "raw";

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
			const result = await minioOffreDeStageRepository.recuperer(
				new FluxTransformation("source", "history", ".xml", ".json"),
			);

			expect(result).to.eql({
				root: {
					title: "Titre offre de stage",
					description: "Description offre de stage",
				},
			});
			expect(uuidClient.generate).to.have.been.calledOnce;
			expect(minioStub.fGetObject).to.have.been.calledOnce;
			expect(minioStub.fGetObject).to.have.been.calledWith(
				configuration.MINIO.RAW_BUCKET_NAME,
				"source/latest.xml",
				localFileNameIncludingPath,
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
			configuration = stubInterface<Configuration>(sinon);
			configuration.MINIO.RAW_BUCKET_NAME = "raw";

			uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
			localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

			minioStub.fGetObject.rejects(new Error("Oops! Something went wrong !"));
		});

		it("je lance une erreur de lecture", async () => {
			await expect(minioOffreDeStageRepository.recuperer(
				new FluxTransformation("source", "history", ".xml", ".json"),
			)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu",
			);
		});
	});

	context("Lorsque je ne réussis pas à lire le contenu d'un fichier", () => {
		beforeEach(() => {
			configuration = stubInterface<Configuration>(sinon);
			configuration.MINIO.RAW_BUCKET_NAME = "raw";

			uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
			localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

			minioStub.fGetObject.resolves();
			contentParserRepository.parse.rejects(new Error("Oops! Something went wrong !"));
		});

		it("je lance une erreur de lecture", async () => {
			await expect(minioOffreDeStageRepository.recuperer(
				new FluxTransformation("source", "history", ".xml", ".json"),
			)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu",
			);
		});
	});
});
