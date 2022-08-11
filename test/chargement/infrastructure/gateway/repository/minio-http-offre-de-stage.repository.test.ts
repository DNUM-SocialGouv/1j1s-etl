import { Client } from "minio";
import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { Configuration } from "@configuration/configuration";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { FileSystemClient } from "@chargement/infrastructure/gateway/node-file-system.client";
import { HttpClient, OffreDeStageHttp } from "@chargement/infrastructure/gateway/http.client";
import { Logger } from "@shared/configuration/logger";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { OffreDeStageFixtureBuilder } from "@test/chargement/fixture/offre-de-stage.fixture-builder";
import { RecupererContenuErreur, RecupererOffresExistantesErreur } from "@shared/gateway/offre-de-stage.repository";
import { UuidGenerator } from "@chargement/infrastructure/gateway/uuid.generator";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

const uuid = "081e4a7c-6c27-4614-a2dd-ecaad37b9073";
const localfileNameIncludingPath = `./tmp/${uuid}`;

let nomDuFlux: string;
let offresMisesAJourAttendues: Array<UnJeune1Solution.OffreDeStage>;
let offresExistantesAttendues: Array<UnJeune1Solution.OffreDeStageExistante>;
let offreDeStageAPublier: UnJeune1Solution.OffreDeStageAPublier;
let offreDeStageASupprimer: UnJeune1Solution.OffreDeStageASupprimer;
let offreDeStageAMettreAJour: UnJeune1Solution.OffreDeStageAMettreAJour;
let offreDeStageNonCategorisable: UnJeune1Solution.OffreDeStage;

let configuration: StubbedType<Configuration>;
let minioClient: StubbedClass<Client>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidGenerator: StubbedType<UuidGenerator>;
let httpClient: StubbedType<HttpClient>;
let logger: StubbedType<Logger>;
let minioHttpOffreDeStageRepository: MinioHttpOffreDeStageRepository;

describe("MinioHttpOffreDeStageRepositoryTest", () => {
	beforeEach(() => {
		nomDuFlux = "source";

		configuration = stubInterface<Configuration>(sinon);
		configuration.MINIO_TRANSFORMED_BUCKET_NAME = "json";
		configuration.MINIO_TRANSFORMED_FILE_EXTENSION = ".json";

		minioClient = stubClass(Client);

		fileSystemClient = stubInterface<FileSystemClient>(sinon);

		uuidGenerator = stubInterface<UuidGenerator>(sinon);
		uuidGenerator.generate.returns(uuid);

		httpClient = stubInterface<HttpClient>(sinon);

		logger = stubInterface<Logger>(sinon);

		minioHttpOffreDeStageRepository = new MinioHttpOffreDeStageRepository(
			configuration,
			minioClient,
			fileSystemClient,
			uuidGenerator,
			httpClient,
			logger
		);
	});

	context("Lorsque je récupère la mise à jour des offres de stage avec le nom du flux", () => {
		beforeEach(() => {
			offresMisesAJourAttendues = [
				OffreDeStageFixtureBuilder.buildOffreDeStage({
					identifiantSource: "Identifiant source",
				}),
				OffreDeStageFixtureBuilder.buildOffreDeStage({
					identifiantSource: "Un autre identifiant source",
				}),
			];

			fileSystemClient.read.resolves(JSON.stringify(offresMisesAJourAttendues));
		});

		it("je retourne la liste mise à jour des offres de stage pour ce dernier", async () => {
			const resultat = await minioHttpOffreDeStageRepository.recupererMisesAJourDesOffres(nomDuFlux);

			expect(resultat).to.have.deep.members(offresMisesAJourAttendues);

			expect(uuidGenerator.generate).to.have.been.calledOnce;

			expect(minioClient.fGetObject).to.have.been.calledOnce;
			expect(minioClient.fGetObject).to.have.been.calledWith(
				"json",
				`${nomDuFlux}/latest.json`,
				localfileNameIncludingPath
			);

			expect(fileSystemClient.read).to.have.been.calledOnce;
			expect(fileSystemClient.read).to.have.been.calledWith(localfileNameIncludingPath);

			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localfileNameIncludingPath);
		});
	});

	context("Lorsque je ne parviens pas à récupérer la mise à jour des offres de stage", () => {
		beforeEach(() => {
			minioClient.fGetObject.rejects(new Error("Oops! Something went wrong !"));
		});

		it("je retourne la liste mise à jour des offres de stage pour ce dernier", async () => {
			await expect(minioHttpOffreDeStageRepository.recupererMisesAJourDesOffres(nomDuFlux)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu"
			);
		});
	});

	context("Lorsque je ne parviens pas à lire le contenu de la mise à jour des offres de stage", () => {
		beforeEach(() => {
			fileSystemClient.read.rejects(new Error("Oops! Something went wrong !"));
		});

		it("je retourne la liste mise à jour des offres de stage pour ce dernier", async () => {
			await expect(minioHttpOffreDeStageRepository.recupererMisesAJourDesOffres(nomDuFlux)).to.be.rejectedWith(
				RecupererContenuErreur,
				"Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu"
			);
		});
	});

	context("Lorsque je récupère la liste des offres de stage existantes", () => {
		beforeEach(() => {
			const offresDeStagesHttp: Array<OffreDeStageHttp> = [{
				id: "Un identifiant technique",
				attributes: {
					identifiantSource: "Un identifiant source",
					sourceUpdatedAt: "2002-01-01T00:00:00.000Z",
				},
			}, {
				id: "Un autre identifiant technique",
				attributes: {
					identifiantSource: "Un autre identifiant source",
					sourceUpdatedAt: "2002-02-01T00:00:00.000Z",
				},
			}];

			offresExistantesAttendues = [
				new UnJeune1Solution.OffreDeStageExistante(
					"Un identifiant technique",
					"Un identifiant source",
					"2002-01-01T00:00:00.000Z",
				), new UnJeune1Solution.OffreDeStageExistante(
					"Un autre identifiant technique",
					"Un autre identifiant source",
					"2002-02-01T00:00:00.000Z",
				),
			];

			httpClient.getAll.withArgs(nomDuFlux).resolves(offresDeStagesHttp);
		});

		it("je récupère les informations nécessaires de ces dernières", async () => {
			const resultat = await minioHttpOffreDeStageRepository.recupererOffresExistantes(nomDuFlux);

			expect(resultat).to.have.deep.members(offresExistantesAttendues);
		});
	});

	context("Lorsque je ne parviens pas à récupérer la liste des offres de stage existantes", () => {
		beforeEach(() => {
			httpClient.getAll.withArgs(nomDuFlux).rejects(new Error("Oops! Something went wrong !"));
		});

		it("je lance une erreur de lecture", async () => {
			await expect(minioHttpOffreDeStageRepository.recupererOffresExistantes(nomDuFlux)).to.be.rejectedWith(
				RecupererOffresExistantesErreur,
				"Une erreur est survenue lors de la récupération des offres existantes"
			);
		});
	});

	context("Lorsque je charge des offres de stage", () => {
		beforeEach(() => {
			httpClient.post.withArgs(offreDeStageAPublier).resolves();
		});

		context("qui sont de nouvelles offres de stage", () => {
			beforeEach(() => {
				offreDeStageAPublier = OffreDeStageFixtureBuilder.buildOffreDeStageAPublier();
			});

			it("j'envoie la donnée", async () => {
				await minioHttpOffreDeStageRepository.charger([offreDeStageAPublier]);

				expect(httpClient.post).to.have.been.calledOnce;
				expect(httpClient.post).to.have.been.calledWith(offreDeStageAPublier);
			});
		});

		context("qui sont des offres de stage à supprimer", () => {
			beforeEach(() => {
				offreDeStageASupprimer = OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer();
			});

			it("j'envoie la donnée", async () => {
				await minioHttpOffreDeStageRepository.charger([offreDeStageASupprimer]);

				expect(httpClient.delete).to.have.been.calledOnce;
				expect(httpClient.delete).to.have.been.calledWith(offreDeStageASupprimer);
			});
		});

		context("qui sont des offres de stage à mettre à jour", () => {
			beforeEach(() => {
				offreDeStageAMettreAJour = OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour();
			});

			it("j'envoie la donnée", async () => {
				await minioHttpOffreDeStageRepository.charger([offreDeStageAMettreAJour]);

				expect(httpClient.put).to.have.been.calledOnce;
				expect(httpClient.put).to.have.been.calledWith(offreDeStageAMettreAJour);
			});
		});

		context("qui sont un mélange des trois types d'offres", () => {
			beforeEach(() => {
				offreDeStageAPublier = OffreDeStageFixtureBuilder.buildOffreDeStageAPublier();
				offreDeStageAMettreAJour = OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour();
				offreDeStageASupprimer = OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer();
			});

			it("j'envoie la donnée", async () => {
				await minioHttpOffreDeStageRepository.charger([
					offreDeStageAMettreAJour,
					offreDeStageAPublier,
					offreDeStageASupprimer,
				]);

				expect(httpClient.put).to.have.been.calledOnce;
				expect(httpClient.put).to.have.been.calledWith(offreDeStageAMettreAJour);
				expect(httpClient.delete).to.have.been.calledOnce;
				expect(httpClient.delete).to.have.been.calledWith(offreDeStageASupprimer);
				expect(httpClient.post).to.have.been.calledOnce;
				expect(httpClient.post).to.have.been.calledWith(offreDeStageAPublier);
			});
		});

		context("qui ne sont pas catégorisables", () => {
			beforeEach(() => {
				offreDeStageNonCategorisable = OffreDeStageFixtureBuilder.buildOffreDeStage();
			});

			it("je log une erreur", async () => {
				await minioHttpOffreDeStageRepository.charger([offreDeStageNonCategorisable]);

				expect(logger.error).to.have.been.calledOnce;
				expect(logger.error).to.have.been.calledWith(`L'offre de stage avec l'identifiant ${offreDeStageNonCategorisable.identifiantSource || "undefined"} n'a pas pu être catégorisée`);
			});
		});
	});
});
