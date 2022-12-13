import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";
import { FluxLogement } from "@logements/chargement/domain/flux";
import { HttpClient } from "@logements/chargement/infrastructure/gateway/client/http.client";
import { StorageClient } from "@logements/chargement/infrastructure/gateway/client/storage.client";
import {
	MinioHttpAnnonceDeLogementRepository,
} from "@logements/chargement/infrastructure/gateway/repository/minio-http-annonce-de-logement.repository";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { Flux } from "@shared/flux";
import { StubbedClass, stubClass } from "@test/configuration";
import {
	AnnonceDeLogementHttpFixtureBuilder,
} from "@test/logements/chargement/fixture/annonce-de-logement-http.fixture-builder";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/chargement/fixture/annonce-de-logement.fixture-builder";
import { expect } from "chai";
import sinon from "sinon";
import { DateService } from "@shared/date.service";
import { Logger, LoggerStrategy } from "@shared/configuration/logger";
import { LogementsChargementLoggerStrategy } from "@logements/chargement/configuration/logger-strategy";
import { ConfigurationFixtureBuilder } from "@test/logements/chargement/fixture/configuration.fixture";

let dateService: StubbedClass<DateService>;
let httpClient: StubbedType<HttpClient>;
let storageClient: StubbedType<StorageClient>;
let repository: MinioHttpAnnonceDeLogementRepository;
let loggerStrategy: StubbedType<LogementsChargementLoggerStrategy>;
let flux: FluxLogement;

describe("AnnonceDeLogementRepositoryTest", () => {
	beforeEach(() => {
		const configuration = ConfigurationFixtureBuilder.build();
		const logger = stubInterface<Logger>(sinon);

		dateService = stubClass(DateService);
		loggerStrategy = stubInterface<LoggerStrategy>(sinon);
		loggerStrategy.get.returns(logger);

		flux = new FluxLogement(configuration.IMMOJEUNE.NAME, configuration.IMMOJEUNE.EXTENSION);
	});

	context("Lorque je souhaite préparer le suivi", () => {
		it("je sauvegarde les résultats pour un flux donner sur un répertoire distant", async () => {
			//GIVEN
			dateService.maintenant.returns(new Date("2022-12-20T15:00:00.000Z"));
			const storageClient = stubInterface<StorageClient>(sinon);
			const httpClient = stubInterface<HttpClient>(sinon);
			const repository: MinioHttpAnnonceDeLogementRepository = new MinioHttpAnnonceDeLogementRepository(
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			);
			const flux = new Flux("immojeune", ".json");

			//WHEN
			await repository.preparerLeSuivi([
				AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceEnErreur(),
			], flux);

			//THEN
			expect(storageClient.ecrire).to.have.been.callCount(4);
			expect(storageClient.ecrire.getCall(0).args).to.have.deep.members([
				`${flux.nom}/2022-12-20T15:00:00.000Z_created${flux.extension}`,
				JSON.stringify([AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce()]),
				flux.nom,
			]);
			expect(storageClient.ecrire.getCall(1).args).to.have.deep.members([
				`${flux.nom}/2022-12-20T15:00:00.000Z_updated${flux.extension}`,
				JSON.stringify([AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour()]),
				flux.nom,
			]);
			expect(storageClient.ecrire.getCall(2).args).to.have.deep.members([
				`${flux.nom}/2022-12-20T15:00:00.000Z_deleted${flux.extension}`,
				JSON.stringify([AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer()]),
				flux.nom,
			]);
			expect(storageClient.ecrire.getCall(3).args).to.have.deep.members([
				`${flux.nom}/2022-12-20T15:00:00.000Z_error${flux.extension}`,
				JSON.stringify([AnnonceDeLogementFixtureBuilder.buildAnnonceEnErreur()]),
				flux.nom,
			]);
		});
	});

	context("Lorsque je charge les annonces de logements sur mon dépot distant", () => {
		beforeEach(() => {
			httpClient = stubInterface<HttpClient>(sinon);
			storageClient = stubInterface<StorageClient>(sinon);
			repository = new MinioHttpAnnonceDeLogementRepository(
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			);
		});

		it("je publie les nouvelles annonces", async () => {
			//GIVEN
			httpClient.post.onSecondCall().rejects();

			//WHEN
			await repository.charger([
				AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce(),
				AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce({ identifiantSource: "annonce-erronnée" }),
			], flux.nom);

			//THEN
			expect(httpClient.post.getCall(0).args).to.have.deep.members([
				AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce(),
			]);
			expect(httpClient.post.getCall(1).args).to.have.deep.members([
				AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce({ identifiantSource: "annonce-erronnée" }),
			]);
		});

		it("je publie les mises à jours des annonces", async () => {
			//given

			//when
			httpClient.put.onSecondCall().rejects();

			await repository.charger([
				AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({ prix: undefined }),
			], flux.nom);

			//then
			expect(httpClient.put.getCall(0).args).to.have.deep.members([
				AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour(),
			]);
			expect(httpClient.put).to.have.been.calledTwice;
		});

		it("je supprime des annonces", async () => {
			//given
			httpClient.delete.onSecondCall().rejects();

			//when
			await repository.charger([
				AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({}, "1"),
				AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({}, "0"),
			], flux.nom);

			//then
			expect(httpClient.delete).to.have.been.calledWith(AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({}, "1"));
		});

		it("je récupère les annonces en erreur", async () => {
			// Given
			const annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement> = [
				AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer(),
			];

			httpClient.post.rejects(new Error("Oops something went wrong!"));
			httpClient.put.rejects(new Error("Oops something went wrong!"));
			httpClient.delete.rejects(new Error("Oops something went wrong!"));

			// When
			const result = await repository.charger(annoncesDeLogement, flux.nom);

			// Then
			expect(result).to.have.deep.members([{
				annonce: AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce().recupererAttributs(),
				motif: "Oops something went wrong!",
			}, {
				annonce: {
					...AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour().recupererAttributs(),
					id: "0",
				},
				motif: "Oops something went wrong!",
			}, {
				annonce: {
					...AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer().recupererAttributs(),
					id: "0",
				},
				motif: "Oops something went wrong!",
			}]);
		});
	});

	context("Lorsque je récupère les annonces déjà publiées", () => {
		it("je récupère l'ensemble des annonces", async () => {
			const storageClient = stubInterface<StorageClient>(sinon);
			const httpClient = stubInterface<HttpClient>(sinon);
			const repository: MinioHttpAnnonceDeLogementRepository = new MinioHttpAnnonceDeLogementRepository(
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			);


			httpClient.get.resolves([AnnonceDeLogementHttpFixtureBuilder.build()]);

			//when

			const result = await repository.recupererAnnoncesDeLogementReferencees(flux);

			//then
			expect(httpClient.get).to.have.been.calledOnce;
			expect(result).to.have.deep.members([{
				identifiantSource: "identifiant-source",
				id: "0",
				sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
			}]);
		});
	});

	context("Lorsque je récupère les mises à jour du flux", () => {
		it("je recupère les annonces du flux", async () => {
			//given
			const storageClient = stubInterface<StorageClient>(sinon);
			const httpClient = stubInterface<HttpClient>(sinon);
			const repository: MinioHttpAnnonceDeLogementRepository = new MinioHttpAnnonceDeLogementRepository(
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			);

			storageClient.lire.resolves([AnnonceDeLogementFixtureBuilder.build()]);

			//when
			const result = await repository.recupererAnnoncesDeLogementNonReferencees(flux);

			//then
			expect(storageClient.lire).to.have.been.calledOnceWith(
				`${flux.nom}/latest${flux.extension}`,
				flux.nom
			);
			expect(result).to.have.deep.members([
				AnnonceDeLogementFixtureBuilder.build(),
			]);
		});
	});
});
