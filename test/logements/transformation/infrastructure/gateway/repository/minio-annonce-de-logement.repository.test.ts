import { Client } from "minio";
import sinon from "sinon";

import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement.fixture-builder";
import { Configuration } from "@logements/transformation/configuration/configuration";
import { DateService } from "@shared/date.service";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { FluxTransformation } from "@logements/transformation/domain/flux";
import { Logger, LoggerStrategy } from "@shared/configuration/logger";
import { MinioAnnonceDeLogementRepository } from "@logements/transformation/infrastructure/gateway/repository/minio-annonce-de-logement.repository";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { UnJeune1Solution } from "@logements/transformation/domain/1jeune1solution";
import { UuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";
import { ContentParserStrategy } from "@shared/infrastructure/gateway/content.parser";

let localFileNameIncludingPath: string;
let minioRepository: MinioAnnonceDeLogementRepository;
let minioStub: StubbedClass<Client>;
let configuration: StubbedType<Configuration>;
let uuidClient: StubbedType<UuidGenerator>;
let dateService: StubbedClass<DateService>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let fileSystemClient: StubbedType<FileSystemClient>;
let contentParserStrategy: StubbedType<ContentParserStrategy>;
const fileContent = "[{\"externalId\":1091498}, {\"externalId\":1091499}]";

describe("MinioRepositoryTest", () => {
	beforeEach(() => {
		minioStub = stubClass(Client);
		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.RAW_BUCKET_NAME = "raw";
		configuration.MINIO.TRANSFORMED_BUCKET_NAME = "json";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";
		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		uuidClient = stubInterface<UuidGenerator>(sinon);
		dateService = stubClass(DateService);
		dateService.maintenant.returns(new Date("2022-12-01T00:00:00.000Z"));

		loggerStrategy = stubInterface<LoggerStrategy>(sinon);
		logger = stubInterface<Logger>(sinon);

		loggerStrategy.get.returns(logger);

		uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
		localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

		contentParserStrategy = stubInterface<ContentParserStrategy>(sinon);
		contentParserStrategy.get.returns([{ externalId: 1091498 }, { externalId: 1091499 }]);

		minioRepository = new MinioAnnonceDeLogementRepository(
			configuration,
			minioStub,
			uuidClient,
			fileSystemClient,
			dateService,
			loggerStrategy,
			contentParserStrategy,
		);
	});

	context("Lorsque je récupère le contenu d'un fichier", () => {
		it("je lis le contenu du fichier", async () => {
			minioStub.fGetObject.resolves();

			fileSystemClient.read.resolves(fileContent);

			const result = await minioRepository.recuperer(new FluxTransformation("source", "history", ".json", ".json"));

			expect(minioStub.fGetObject).to.have.been.calledOnce;
			expect(fileSystemClient.read).to.have.been.calledOnce;
			expect(minioStub.fGetObject).to.have.been.calledWith(
				configuration.MINIO.RAW_BUCKET_NAME,
				"source/latest.json",
				localFileNameIncludingPath,
			);

			expect(fileSystemClient.delete).to.have.been.calledOnceWith(localFileNameIncludingPath);

			expect(result).to.have.deep.members([{ externalId: 1091498 }, { externalId: 1091499 }]);

			expect(logger.info).to.have.been.calledWith("Starting to pull flow source");
			expect(logger.info).to.have.been.calledWith("Ending to pull flow source");
		});
	});

	context("Lorsque j'essaie de récupérer le contenu d'un fichier qui n'existe pas", () => {
		it("je lance une erreur de lecture", async () => {
			minioStub.fGetObject.rejects(new Error("Oops! Something went wrong !"));

			await expect(minioRepository.recuperer(
				new FluxTransformation("source", "history", ".json", ".json"),
			)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu",
			);
		});
	});

	context("Lorsque je ne réussis pas à récupérer le contenu d'un fichier", () => {
		it("je lance une erreur de lecture", async () => {
			minioStub.fGetObject.resolves();
			fileSystemClient.read.withArgs(localFileNameIncludingPath).rejects(new Error("Oops! Something went wrong !"));

			await expect(minioRepository.recuperer(
				new FluxTransformation("source", "history", ".json", ".json"),
			)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu",
			);
		});
	});

	context("Lorsque je sauvegarde les annonces de logements transformées", () => {
		it("j'écris le contenu dans les fichiers", async () => {
			const flux = new FluxTransformation("immojeune", "history", ".json", ".json");
			const annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement> = [
				AnnonceDeLogementFixtureBuilder.build(),
				AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "external-id-2" }),
			];

			await minioRepository.sauvegarder(annoncesDeLogement, flux);

			expect(minioStub.fPutObject.firstCall.args).to.have.deep.members([
				configuration.MINIO.TRANSFORMED_BUCKET_NAME,
				`${flux.nom}/${flux.dossierHistorisation}/2022-12-01T00:00:00.000Z${flux.extensionFichierTransforme}`,
				localFileNameIncludingPath,
			]);

			expect(minioStub.fPutObject.secondCall.args).to.have.deep.members([
				configuration.MINIO.TRANSFORMED_BUCKET_NAME,
				`${flux.nom}/latest${flux.extensionFichierTransforme}`,
				localFileNameIncludingPath,
			]);

			expect(dateService.maintenant).to.have.been.calledOnce;

			expect(fileSystemClient.write.getCall(0).args[0]).to.eq(localFileNameIncludingPath);
			expect(JSON.parse(fileSystemClient.write.getCall(0).args[1] as string)).to.have.deep.members([
				AnnonceDeLogementFixtureBuilder.build(),
				AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "external-id-2" }),
			]);

			expect(fileSystemClient.delete).to.have.been.calledOnceWith(localFileNameIncludingPath);

			expect(logger.info).to.have.been.calledWith(`Starting to save transformed housing adverts from ${flux.nom}`);
			expect(logger.info).to.have.been.calledWith(`Ending to save transformed housing adverts from ${flux.nom}`);
		});
	});

	context("Lorsque je rencontre une erreur dans la sauvegarde des annonces de logements transformées", () => {
		it("je lance une erreur", async () => {
			const flux = new FluxTransformation("immojeune", "history", ".json", ".json");
			const annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement> = [
				AnnonceDeLogementFixtureBuilder.build(),
				AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "external-id-2" }),
			];

			fileSystemClient.write.rejects(new Error("Oops! Something went wrong"));

			await expect(minioRepository.sauvegarder(annoncesDeLogement, flux)).to.have.been.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${flux.nom} n'a pas été extrait car une erreur d'écriture est survenue`
			);

			expect(logger.info).to.have.been.calledWith(`Starting to save transformed housing adverts from ${flux.nom}`);
			expect(logger.info).to.have.been.calledWith(`Ending to save transformed housing adverts from ${flux.nom}`);
		});
	});
});
