import { Client } from "minio";
import { Configuration } from "@evenements/src/transformation/configuration/configuration";
import { DateService } from "@shared/src/date.service";
import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/configuration";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { FluxTransformation } from "@evenements/src/transformation/domain/model/flux";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { Logger, LoggerStrategy } from "@shared/src/configuration/logger";
import {
	MinioEvenementRepository,
} from "@evenements/src/transformation/infrastructure/gateway/repository/minio-evenement.repository";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import { UnJeuneUneSolution } from "@evenements/src/transformation/domain/model/1jeune1solution";

let localFileNameIncludingPath: string;
let evenements: Array<UnJeuneUneSolution.Evenement>;
let fileContent: string;
let latestFileNameIncludingPath: string;
let historyFileNameIncludingPath: string;

let configuration: StubbedType<Configuration>;
let fileSystemClient: StubbedType<FileSystemClient>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let flux: FluxTransformation;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let dateService: StubbedClass<DateService>;
let minioEvenenementRepository: MinioEvenementRepository;

describe("MinioEvenementRepositoryTest", () => {
	beforeEach(() => {
		latestFileNameIncludingPath = "source/latest.json";
		historyFileNameIncludingPath = "source/history/2022-01-01T00:00:00.000Z.json";
		fileContent = JSON.stringify([
			{
				"date": "24/11/2022",
				"description": "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
				"horaireDebutEvenement": "09:00",
				"horaireFinEvenement": "12:00",
				"id": "272709",
				"lieuEvenement": "Matha",
				"modaliteInscription": "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
				"online": false,
				"organismeOrganisateur": "Agence pôle emploi - SAINT JEAN D ANGELY",
				"titreEvenement": "Pôle emploi - Recrutement ADEF+",
				"typeEvenement": "job_dating",
			},
			{
				"date": "24/11/2022",
				"description": "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
				"horaireDebutEvenement": "08:30",
				"horaireFinEvenement": "16:15",
				"id": "272510",
				"lieuEvenement": "Clermont",
				"modaliteInscription": "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
				"online": false,
				"organismeOrganisateur": "Agence pôle emploi - CLERMONT FITZ JAMES",
				"titreEvenement": "Pôle emploi - LACTALIS",
				"typeEvenement": "seance_information",
			},
		]);
		flux = new FluxTransformation("source", "history", ".json", ".json");

		evenements = [
			{
				dateDebut: "24/11/2022T09:00:00",
				description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
				idSource: "272709",
				lieuEvenement: "Matha",
				modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
				online: false,
				organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
				titreEvenement: "Pôle emploi - Recrutement ADEF+",
				typeEvenement: "job_dating",
				source: "tous-mobilises",
				dateFin: "24/11/2022T12:00:00",
			},
			{
				dateDebut: "24/11/2022T08:30:00",
				description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
				idSource: "272510",
				lieuEvenement: "Clermont",
				modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
				online: false,
				organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
				titreEvenement: "Pôle emploi - LACTALIS",
				typeEvenement: "seance_information",
				source: "tous-mobilises",
				dateFin: "24/11/2022T16:15:00",
			},
		];

		localFileNameIncludingPath = "./tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";

		minioStub = stubClass(Client);

		loggerStrategy = stubInterface<LoggerStrategy>(sinon);
		logger = stubInterface<Logger>(sinon);
		loggerStrategy.get.returns(logger);

		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO.RAW_BUCKET_NAME = "raw";
		configuration.MINIO.TRANSFORMED_BUCKET_NAME = "json";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";

		fileSystemClient = stubInterface<FileSystemClient>(sinon);
		uuidClient = stubInterface<UuidGenerator>(sinon);
		dateService = stubClass(DateService);
		dateService.maintenant.returns(new Date("2022-01-01T00:00:00.000Z"));

		uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");
		minioEvenenementRepository = new MinioEvenementRepository(
			configuration,
			minioStub,
			fileSystemClient,
			uuidClient,
			dateService,
			loggerStrategy,
			new JsonContentParser(),
		);
	});

	describe("recuperer", () => {
		context("Lorsque je récupère le contenu d'un fichier", () => {
			beforeEach(() => {
				configuration = stubInterface<Configuration>(sinon);
				configuration.MINIO.RAW_BUCKET_NAME = "raw";

				uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
				localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

				minioStub.fGetObject.resolves();
				fileSystemClient.read.resolves(fileContent);
			});

			it("je récupère le contenu du fichier", async () => {
				const result = await minioEvenenementRepository.recuperer(
					new FluxTransformation("source", "history", ".json", ".json")
				);

				expect(result).to.eql([
					{
						"date": "24/11/2022",
						"description": "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
						"horaireDebutEvenement": "09:00",
						"horaireFinEvenement": "12:00",
						"id": "272709",
						"lieuEvenement": "Matha",
						"modaliteInscription": "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
						"online": false,
						"organismeOrganisateur": "Agence pôle emploi - SAINT JEAN D ANGELY",
						"titreEvenement": "Pôle emploi - Recrutement ADEF+",
						"typeEvenement": "job_dating",
					},
					{
						"date": "24/11/2022",
						"description": "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
						"horaireDebutEvenement": "08:30",
						"horaireFinEvenement": "16:15",
						"id": "272510",
						"lieuEvenement": "Clermont",
						"modaliteInscription": "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
						"online": false,
						"organismeOrganisateur": "Agence pôle emploi - CLERMONT FITZ JAMES",
						"titreEvenement": "Pôle emploi - LACTALIS",
						"typeEvenement": "seance_information",
					},
				]);
				expect(uuidClient.generate).to.have.been.calledOnce;
				expect(minioStub.fGetObject).to.have.been.calledOnce;
				expect(minioStub.fGetObject).to.have.been.calledWith(
					configuration.MINIO.RAW_BUCKET_NAME,
					"source/latest.json",
					localFileNameIncludingPath
				);
				expect(fileSystemClient.read).to.have.been.calledOnce;
				expect(fileSystemClient.read).to.have.been.calledWith(localFileNameIncludingPath);
				expect(fileSystemClient.delete).to.have.been.calledOnce;
				expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
			});
		});

		context("Lorsque je ne réussis pas à lire le contenu d'un fichier", () => {
			beforeEach(() => {
				configuration = stubInterface<Configuration>(sinon);
				configuration.MINIO.RAW_BUCKET_NAME = "raw";

				uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
				localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

				minioStub.fGetObject.resolves();
			});

			it("je lance une erreur de lecture", async () => {
				await expect(minioEvenenementRepository.recuperer(
					new FluxTransformation("source", "history", ".xml", ".json",)
				)).to.be.rejectedWith(
					RecupererContenuErreur,
					"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu"
				);
			});
		});
	});

	describe("sauvegarder", () => {
		context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
			it("j'écris le contenu d'un fichier", async () => {
				await minioEvenenementRepository.sauvegarder(evenements, flux);

				expect(uuidClient.generate).to.have.been.calledOnce;

				expect(fileSystemClient.write).to.have.been.calledOnce;
				expect(fileSystemClient.write.getCall(0).args[0]).to.eql(localFileNameIncludingPath);
				expect(JSON.parse(fileSystemClient.write.getCall(0).args[1] as string)).to.have.deep.members(evenements);

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
				await expect(minioEvenenementRepository.sauvegarder(evenements, flux)).to.be.rejectedWith(
					EcritureFluxErreur,
					"Le flux source n'a pas été extrait car une erreur d'écriture est survenue"
				);
			});
		});

		context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
			" fichier est invalide", () => {
			beforeEach(() => {
				minioStub.fPutObject.rejects();
			});

			it("je lance une erreur", async () => {
				await expect(minioEvenenementRepository.sauvegarder(evenements, flux)).to.be.rejectedWith(
					EcritureFluxErreur,
					"Le flux source n'a pas été extrait car une erreur d'écriture est survenue"
				);
				expect(fileSystemClient.delete).to.have.been.calledOnce;
				expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
			});
		});
	});
});
