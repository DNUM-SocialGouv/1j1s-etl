import { Client } from "minio";
import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { Configuration } from "@chargement/configuration/configuration";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import {
	EcritureFluxErreur,
	RecupererContenuErreur,
	RecupererOffresExistantesErreur,
} from "@shared/gateway/offre-de-stage.repository";
import { FileSystemClient } from "@chargement/infrastructure/gateway/node-file-system.client";
import { HttpClient, OffreDeStageHttp } from "@chargement/infrastructure/gateway/http.client";
import { Logger } from "@shared/configuration/logger";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { OffreDeStageFixtureBuilder } from "@test/chargement/fixture/offre-de-stage.fixture-builder";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";
import { UuidGenerator } from "@chargement/infrastructure/gateway/uuid.generator";

const uuid = "081e4a7c-6c27-4614-a2dd-ecaad37b9073";
const localFileNameIncludingPath = `./tmp/${uuid}`;
const filePathForMinio = "source/nom-du-fichier";

const erreurDePublication = new Error("Oops something went wrong");
const erreurDeMiseAJour = new Error("Oops something went wrong");
const erreurDeSuppression = new Error("Oops something went wrong");

let nomDuFlux: string;
let contenu: string;
let offresMisesAJourAttendues: Array<UnJeune1Solution.OffreDeStage>;
let offresExistantesAttendues: Array<UnJeune1Solution.OffreDeStageExistante>;
let offreDeStageAPublier: UnJeune1Solution.OffreDeStageAPublier;
let offreDeStageASupprimer: UnJeune1Solution.OffreDeStageASupprimer;
let offreDeStageAMettreAJour: UnJeune1Solution.OffreDeStageAMettreAJour;
let offreDeStageNonCategorisable: UnJeune1Solution.OffreDeStage;
let offresDeStagePourException: Array<UnJeune1Solution.OffreDeStage>;

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
		configuration.MINIO_RESULT_BUCKET_NAME = "result";
		configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";

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
				localFileNameIncludingPath
			);

			expect(fileSystemClient.read).to.have.been.calledOnce;
			expect(fileSystemClient.read).to.have.been.calledWith(localFileNameIncludingPath);

			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
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

		context("qui tombent en erreur", () => {
			beforeEach(() => {
				offresDeStagePourException = MinioHttpOffreDeStageRepositoryTest.initialiserOffresDeStagePourException();

				MinioHttpOffreDeStageRepositoryTest.initialiserLeRejetSurLesAppelsHttp();
			});

			context("avec une stacktrace", () => {
				it("je retourne les offres que je n'ai pas pu charger", async () => {
					const resultat = await minioHttpOffreDeStageRepository.charger([...offresDeStagePourException]);

					expect(resultat).to.have.deep.members([
						{
							contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
								identifiantSource: "Un premier identifiant source",
							}),
							motif: erreurDePublication.stack,
						},
						{
							contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
								identifiantSource: "Un troisième identifiant source",
							}, "Un premier identifiant technique"),
							motif: erreurDeMiseAJour.stack,
						},
						{
							contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
								identifiantSource: "Un cinquième identifiant source",
							}, "Un troisième identifiant technique"),
							motif: erreurDeSuppression.stack,
						},
					]);

					expect(httpClient.post).to.have.been.calledTwice;
					expect(httpClient.post.getCall(0).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
						identifiantSource: "Un premier identifiant source",
					})]);
					expect(httpClient.post.getCall(1).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
						identifiantSource: "Un second identifiant source",
					})]);

					expect(httpClient.delete).to.have.been.calledTwice;
					expect(httpClient.delete.getCall(0).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
						identifiantSource: "Un cinquième identifiant source",
					}, "Un troisième identifiant technique")]);
					expect(httpClient.delete.getCall(1).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
						identifiantSource: "Un sixième identifiant source",
					}, "Un quatrième identifiant technique")]);

					expect(httpClient.put).to.have.been.calledTwice;
					expect(httpClient.put.getCall(0).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
						identifiantSource: "Un troisième identifiant source",
					}, "Un premier identifiant technique")]);
					expect(httpClient.put.getCall(1).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
						identifiantSource: "Un quatrième identifiant source",
					}, "Un second identifiant technique")]);
				});
			});

			context("sans stacktrace", () => {
				beforeEach(() => {
					erreurDePublication.stack = undefined;
					erreurDeMiseAJour.stack = undefined;
					erreurDeSuppression.stack = undefined;
				});

				it("je retourne les offres que je n'ai pas pu charger", async () => {
					const resultat = await minioHttpOffreDeStageRepository.charger([...offresDeStagePourException]);

					expect(resultat).to.have.deep.members([
						{
							contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
								identifiantSource: "Un premier identifiant source",
							}),
							motif: erreurDePublication.message,
						},
						{
							contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
								identifiantSource: "Un troisième identifiant source",
							}, "Un premier identifiant technique"),
							motif: erreurDePublication.message,
						},
						{
							contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
								identifiantSource: "Un cinquième identifiant source",
							}, "Un troisième identifiant technique"),
							motif: erreurDePublication.message,
						},
					]);

					expect(httpClient.post).to.have.been.calledTwice;
					expect(httpClient.post.getCall(0).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
						identifiantSource: "Un premier identifiant source",
					})]);
					expect(httpClient.post.getCall(1).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
						identifiantSource: "Un second identifiant source",
					})]);

					expect(httpClient.delete).to.have.been.calledTwice;
					expect(httpClient.delete.getCall(0).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
						identifiantSource: "Un cinquième identifiant source",
					}, "Un troisième identifiant technique")]);
					expect(httpClient.delete.getCall(1).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
						identifiantSource: "Un sixième identifiant source",
					}, "Un quatrième identifiant technique")]);

					expect(httpClient.put).to.have.been.calledTwice;
					expect(httpClient.put.getCall(0).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
						identifiantSource: "Un troisième identifiant source",
					}, "Un premier identifiant technique")]);
					expect(httpClient.put.getCall(1).args).to.have.deep.members([OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
						identifiantSource: "Un quatrième identifiant source",
					}, "Un second identifiant technique")]);
				});
			});
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

			it("j'ajoute l'offre de stage dans les offres en erreur", async () => {
				const resultat = await minioHttpOffreDeStageRepository.charger([offreDeStageNonCategorisable]);

				expect(logger.error).to.have.been.calledOnce;
				expect(logger.error).to.have.been.calledWith(
					`L'offre de stage avec l'identifiant ${offreDeStageNonCategorisable.identifiantSource || "undefined"} n'a pas pu être catégorisée`
				);

				expect(resultat).to.have.deep.members([{
					contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStage(),
					motif: `L'offre de stage avec l'identifiant ${offreDeStageNonCategorisable.identifiantSource || "undefined"} n'a pas pu être catégorisée`,
				}]);
			});

			context("et qui n'a pas d'identifiant source", () => {
				beforeEach(() => {
					offreDeStageNonCategorisable = OffreDeStageFixtureBuilder.buildOffreDeStage({ identifiantSource: undefined });
				});

				it("j'ajoute l'offre de stage dans les offres en erreur", async () => {
					const resultat = await minioHttpOffreDeStageRepository.charger([offreDeStageNonCategorisable]);

					expect(logger.error).to.have.been.calledOnce;
					expect(logger.error).to.have.been.calledWith(
						"L'offre de stage avec l'identifiant undefined n'a pas pu être catégorisée"
					);

					expect(resultat).to.have.deep.members([{
						contenuDeLOffre: OffreDeStageFixtureBuilder.buildOffreDeStage({ identifiantSource: undefined }),
						motif: "L'offre de stage avec l'identifiant undefined n'a pas pu être catégorisée",
					}]);
				});
			});
		});
	});

	context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
		it("j'écris le contenu d'un fichier", async () => {
			await minioHttpOffreDeStageRepository.enregistrer(filePathForMinio, contenu, nomDuFlux);

			expect(uuidGenerator.generate).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledOnce;
			expect(fileSystemClient.write).to.have.been.calledWith(localFileNameIncludingPath, contenu);
			expect(minioClient.fPutObject).to.have.been.calledOnce;
			expect(minioClient.fPutObject).to.have.been.calledWith(
				configuration.MINIO_RESULT_BUCKET_NAME,
				filePathForMinio,
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
			await expect(minioHttpOffreDeStageRepository.enregistrer(filePathForMinio, contenu, nomDuFlux)).to.be.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${nomDuFlux} n'a pas été extrait car une erreur d'écriture est survenue`
			);
		});
	});

	context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
		" fichier est invalide", () => {
		beforeEach(() => {
			minioClient.fPutObject.rejects();
		});

		it("je lance une erreur", async () => {
			await expect(minioHttpOffreDeStageRepository.enregistrer(filePathForMinio, contenu, nomDuFlux)).to.be.rejectedWith(
				EcritureFluxErreur,
				`Le flux ${nomDuFlux} n'a pas été extrait car une erreur d'écriture est survenue`
			);
			expect(fileSystemClient.delete).to.have.been.calledOnce;
			expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
		});
	});
});

class MinioHttpOffreDeStageRepositoryTest {
	static initialiserLeRejetSurLesAppelsHttp(): void {
		httpClient.post.withArgs(
			OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
				identifiantSource: "Un premier identifiant source",
			})
		).rejects(erreurDePublication);

		httpClient.put.withArgs(
			OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
				identifiantSource: "Un troisième identifiant source",
			}, "Un premier identifiant technique")
		).rejects(erreurDeMiseAJour);

		httpClient.delete.withArgs(
			OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
				identifiantSource: "Un cinquième identifiant source",
			}, "Un troisième identifiant technique"),
		).rejects(erreurDeSuppression);
	}

	static initialiserOffresDeStagePourException(): Array<UnJeune1Solution.OffreDeStage> {
		return [
			OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
				identifiantSource: "Un premier identifiant source",
			}),
			OffreDeStageFixtureBuilder.buildOffreDeStageAPublier({
				identifiantSource: "Un second identifiant source",
			}),
			OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
				identifiantSource: "Un troisième identifiant source",
			}, "Un premier identifiant technique"),
			OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({
				identifiantSource: "Un quatrième identifiant source",
			}, "Un second identifiant technique"),
			OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
				identifiantSource: "Un cinquième identifiant source",
			}, "Un troisième identifiant technique"),
			OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({
				identifiantSource: "Un sixième identifiant source",
			}, "Un quatrième identifiant technique"),
		];
	}
}
