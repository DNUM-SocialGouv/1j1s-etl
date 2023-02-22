import { expect, sinon, StubbedType, stubInterface } from "@test/configuration";

import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/chargement/fixture/annonce-de-logement.fixture-builder";
import { AnnonceDeLogementRepository } from "@logements/src/chargement/domain/service/annonce-de-logement.repository";
import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/src/chargement/domain/service/charger-annonces-de-logement.domain-service";
import { FluxChargement } from "@logements/src/chargement/domain/model/flux";
import { UnJeune1Solution } from "@logements/src/chargement/domain/model/1jeune1solution";

let annonceDeLogementRepository: StubbedType<AnnonceDeLogementRepository>;
let chargerFluxImmojeune: ChargerAnnoncesDeLogementDomainService;
const flux: FluxChargement = new FluxChargement("Immojeune", ".json");

describe("ChargerAnnoncesDeLogementDomainServiceTest", () => {
	context("Lorsque je charge le flux Immojeune sur mon dépôt distant", () => {
		beforeEach(() => {
			// Given
			annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
			chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);
			annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves([{
				id: "0",
				identifiantSource: "supprimer",
				sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
			}, {
				id: "1",
				identifiantSource: "existante",
				sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
			}]);
			annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves([
				AnnonceDeLogementFixtureBuilder.build(),
				AnnonceDeLogementFixtureBuilder.build({
					identifiantSource: "existante",
					sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
				}),
			]);
		});

		it("je récupère mon flux", async () => {
			// Given
			annonceDeLogementRepository.charger.resolves([]);

			// When
			await chargerFluxImmojeune.charger(flux);

			// Then
			expect(annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees).to.have.been.calledOnce;
		});

		it("je charge mon flux", async () => {
			// Given
			annonceDeLogementRepository.charger.resolves([]);

			// When
			await chargerFluxImmojeune.charger(flux);

			// Then
			expect(annonceDeLogementRepository.charger.getCall(0).args).to.have.deep.members([[
				AnnonceDeLogementFixtureBuilder.build(),
				AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({ identifiantSource: "supprimer" }, "0"),
				AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({
					identifiantSource: "existante",
					sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
				}, "1"),
			], "Immojeune"]);
		});

		it("je prépare le suivi", async () => {
			annonceDeLogementRepository.charger.resolves(
				[AnnonceDeLogementFixtureBuilder.buildAnnonceEnErreur(
					{ annonce: AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce() }
				)],
			);
			// When
			await chargerFluxImmojeune.charger(flux);

			expect(annonceDeLogementRepository.preparerLeSuivi.getCall(0).args).to.have.deep.members([
				[
					AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce(),
					AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({ "identifiantSource": "supprimer" }),
					AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({
						identifiantSource: "existante", sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
					}, "1"),
					AnnonceDeLogementFixtureBuilder.buildAnnonceEnErreur(
						{ annonce: AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce() }
					),
				],
				new FluxChargement("Immojeune", ".json"),
			]);
		});
	});

	context("Lorsque j'ai des différences entre le flux récupéré d'Immojeune et le contenu existant", () => {
		beforeEach(() => {
			annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
			annonceDeLogementRepository.charger.resolves([]);
		});

		context("et que j'ai de nouvelles annonces", () => {
			it("je charge ces nouvelles offres", async () => {
				// Given
				chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);
				const nouvellesAnnoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement> = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "existant" }),
					AnnonceDeLogementFixtureBuilder.build(),
				];
				const annoncesDeLogementReferencees: Array<UnJeune1Solution.AnnonceDeLogementReferencee> = [
					{ identifiantSource: "existant", sourceUpdatedAt: "2022-12-01T00:00:00.000Z", id: "0" },
				];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(nouvellesAnnoncesDeLogement);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementReferencees);

				// When
				await chargerFluxImmojeune.charger(flux);

				// Then
				expect(annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees).to.have.been.calledOnce;
				expect(annonceDeLogementRepository.charger).to.have.been.calledOnceWith([
					AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce(),
				], "Immojeune");
			});
		});

		context("et que j'ai des annonces qui ne sont plus présentes", () => {
			it("je supprime ces annonces", async () => {
				// Given
				chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);
				const annoncesDeLogementsNonReferencees: Array<UnJeune1Solution.AnnonceDeLogement> = [
					AnnonceDeLogementFixtureBuilder.build(),
				];
				const annoncesDeLogementExistantes: Array<UnJeune1Solution.AnnonceDeLogementReferencee> = [
					{ identifiantSource: "ancienne", sourceUpdatedAt: "2022-12-01T00:00:00.000Z", id: "0" },
					{ identifiantSource: "a supprimer", sourceUpdatedAt: "2022-12-01T00:00:00.000Z", id: "1" },
					{ identifiantSource: "identifiant-source", sourceUpdatedAt: "2022-12-01T00:00:00.000Z", id: "2" },
				];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.charger(flux);

				// Then
				expect(annonceDeLogementRepository.charger).to.have.been.calledOnceWith([
					AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({ identifiantSource: "ancienne" }, "0"),
					AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({ identifiantSource: "a supprimer" }, "1"),
				], "Immojeune");
			});
		});

		context("et que j'ai des annonces qui ont été mises à jour avec une date explicite plus récente", () => {
			it("je mets à jour ces annonces", async () => {
				// Given
				chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);
				const annoncesDeLogementsNonReferencees = [
					AnnonceDeLogementFixtureBuilder.build({
						identifiantSource: "existante",
						sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
					}),
				];
				const annoncesDeLogementExistantes: Array<UnJeune1Solution.AnnonceDeLogementReferencee> = [{
					identifiantSource: "existante",
					sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
					id: "0",
				}];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.charger(flux);

				// Then
				expect(annonceDeLogementRepository.charger).to.have.been.calledOnceWith([
					AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({
						"identifiantSource": "existante",
						"sourceUpdatedAt": "2023-01-01T00:00:00.000Z",
					}),
				], "Immojeune");
			});
		});

		context("et que j'ai des annonces qui sont toujours présentes mais non mises à jour", () => {
			it("je ne fais rien", async () => {
				// Given
				chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);
				const annoncesDeLogementsNonReferencees: Array<UnJeune1Solution.AnnonceDeLogement> = [
					AnnonceDeLogementFixtureBuilder.build(),
				];
				const annoncesDeLogementExistantes: Array<UnJeune1Solution.AnnonceDeLogementReferencee> = [{
					id: "0",
					sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
					identifiantSource: "identifiant-source",
				}];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.charger(flux);

				// Then
				expect(annonceDeLogementRepository.charger).to.have.been.calledOnceWith([], "Immojeune");
			});
		});

		context("et j'ai plusieurs sorte d'annonces à charger", () => {
			it("je charge les différentes annonces", async () => {
				const nouvellesAnnoncesDeLogement = [AnnonceDeLogementFixtureBuilder.build({ "identifiantSource": "nouvelle-annonce" })];
				const annonceDeLogementAMettreAjour = [
					AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour(
						{
							"identifiantSource": "annonce-a-mettre-a-jour",
							"sourceUpdatedAt": "2023-01-01T00:00:00.000Z",
						})];

				const annoncesDeLogementsASupprimer = [
					AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer(
						{ "identifiantSource": "annonce-a-supprimer" },
					),
				];
				const annoncesDeLogementsNonReferencees = [
					AnnonceDeLogementFixtureBuilder.build(),
					AnnonceDeLogementFixtureBuilder.build({ "identifiantSource": "nouvelle-annonce" }),
					AnnonceDeLogementFixtureBuilder.build({
							"identifiantSource": "annonce-a-mettre-a-jour",
							"sourceUpdatedAt": "2023-01-01T00:00:00.000Z",
						},
					),
				];
				const annoncesDeLogementsReferences = [
					AnnonceDeLogementFixtureBuilder.build(),
					AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour(
						{
							"identifiantSource": "annonce-a-mettre-a-jour",
							"sourceUpdatedAt": "2022-01-01T00:00:00.000Z",
						}),
					AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer(
						{ "identifiantSource": "annonce-a-supprimer" },
					),
				];
				const flux = new FluxChargement("Immojeune", ".json");

				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementsReferences);
				chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);

				await chargerFluxImmojeune.charger(flux);

				expect(annonceDeLogementRepository.charger.getCall(0).args).to.have.deep.members([[
					...nouvellesAnnoncesDeLogement,
					...annoncesDeLogementsASupprimer,
					...annonceDeLogementAMettreAjour,
				], "Immojeune"]);
			});
		});

		context("et que j'ai des annonces avec une localisation vide", () => {
			it("je retire ses annonces du chargement ", async () => {
				const annoncesDeLogementsReferences = [
					AnnonceDeLogementFixtureBuilder.build(),
				];
				const annoncesDeLogementsNonReferencees = [
					AnnonceDeLogementFixtureBuilder.build(),
					AnnonceDeLogementFixtureBuilder.build({ "identifiantSource": "nouvelle-annonce" }),
					AnnonceDeLogementFixtureBuilder.build({
							"identifiantSource": "annonce-a-supprimer",
							"sourceUpdatedAt": "2023-01-01T00:00:00.000Z",
							"localisation": {
								pays: "",
								codePostal: "",
								ville: "",
								latitude: 0,
								longitude: 0,
							},
						},
					),
				];

				const annoncesDeLogementsNonReferenceesTriees = [
					AnnonceDeLogementFixtureBuilder.build({ "identifiantSource": "nouvelle-annonce" }),
				];
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementsReferences);
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesDeLogementsNonReferencees);

				chargerFluxImmojeune = new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);

				await chargerFluxImmojeune.charger(flux);
				expect(annonceDeLogementRepository.charger.getCall(0).args).to.have.deep.members([[
					...annoncesDeLogementsNonReferenceesTriees,
				], "Immojeune"]);

			});
		});
	});
});
