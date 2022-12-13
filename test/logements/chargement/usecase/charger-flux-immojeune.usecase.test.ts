import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";
import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import { FluxLogement } from "@logements/chargement/domain/flux";
import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { expect } from "@test/configuration";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/chargement/fixture/annonce-de-logement.fixture-builder";
import sinon from "sinon";

let annonceDeLogementRepository: StubbedType<AnnonceDeLogementRepository>;
let chargerFluxImmojeune: ChargerFluxImmojeune;
const flux: FluxLogement = new FluxLogement("Immojeune", ".json");

describe("ChargerFluxImmojeuneTest", () => {
	context("Lorsque je charge le flux Immojeune sur mon dépôt distant", () => {
		beforeEach(() => {
			// Given
			annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
			chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
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
			// When
			await chargerFluxImmojeune.executer(flux);

			// Then
			expect(annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees).to.have.been.calledOnce;
		});

		it("je charge mon flux", async () => {
			// When
			await chargerFluxImmojeune.executer(flux);

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
			
		});

		it("j'enregistre le résultat du chargement de nouvelles annonces", async () => {
			// When
			await chargerFluxImmojeune.executer(flux);

			// Then
			expect(annonceDeLogementRepository.preparerLeSuivi.getCall(0).args).to.have.deep.members([
				[AnnonceDeLogementFixtureBuilder.build()],
				new FluxLogement("Immojeune", ".json"),
			]);
		});

		it("j'enregistre le résultat du chargement d'annonces à supprimer", async () => {
			await chargerFluxImmojeune.executer(flux);

			expect(annonceDeLogementRepository.preparerLeSuivi.getCall(1).args).to.have.deep.members([
				[AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({ "identifiantSource": "supprimer" })],
				new FluxLogement("Immojeune", ".json"),
			]);
		});

		it("j'enregistre le résultat du chargement d'annonces à mettre à jour", async () => {
			await chargerFluxImmojeune.executer(flux);

			expect(annonceDeLogementRepository.preparerLeSuivi.getCall(2).args).to.have.deep.members([
				[AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({
					identifiantSource: "existante", sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
				}, "1")],
				new FluxLogement("Immojeune", ".json"),
			]);
		});

		it("j'enregistre le résultat du chargement d'annonces tombées en erreur", async () => {
			// Given
			const annoncesNonReferencees: Array<UnJeune1Solution.AnnonceDeLogement> = [
				AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "nouvelle-annonce" }),
			];
			const annoncesReferencees: Array<UnJeune1Solution.AnnonceDeLogementReferencee> = [];

			annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesNonReferencees);
			annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesReferencees);

			annonceDeLogementRepository.charger
				.withArgs([AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce({ identifiantSource: "nouvelle-annonce" })])
				.resolves([AnnonceDeLogementFixtureBuilder.buildAnnonceEnErreur(
					{ annonce: AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce() }
				)]);

			// When
			await chargerFluxImmojeune.executer(flux);

			// Then
			expect(annonceDeLogementRepository.preparerLeSuivi.getCall(3).args).to.have.deep.members([
				[AnnonceDeLogementFixtureBuilder.buildAnnonceEnErreur(
					{ annonce: AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce() }
				)], new FluxLogement("Immojeune", ".json"),
			]);
		});
	});

	context("Lorsque j'ai des différences entre le flux récupéré d'Immojeune et le contenu existant", () => {
		context("et que j'ai de nouvelles annonces", () => {
			it("je charge ces nouvelles offres", async () => {
				// Given
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
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
				await chargerFluxImmojeune.executer(flux);

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
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
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
				await chargerFluxImmojeune.executer(flux);

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
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
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
				await chargerFluxImmojeune.executer(flux);

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
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
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
				await chargerFluxImmojeune.executer(flux);

				// Then
				expect(annonceDeLogementRepository.charger).to.have.been.calledOnceWith([], "Immojeune");
			});
		});

		context("et j'ai plusieurs sorte d'annonce à charger", () => {
			it("je charge les différentes annonces", async () => {
				const nouvellesAnnoncesDeLogement = [AnnonceDeLogementFixtureBuilder.build({ "identifiantSource": "nouvelle-annnonce" })];
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
					AnnonceDeLogementFixtureBuilder.build({ "identifiantSource": "nouvelle-annnonce" }),
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
				const flux = new FluxLogement("Immojeune", ".json");

				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.resolves(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.resolves(annoncesDeLogementsReferences);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);


				await chargerFluxImmojeune.executer(flux);

				expect(annonceDeLogementRepository.charger.getCall(0).args).to.have.deep.members([[
					...nouvellesAnnoncesDeLogement,
					...annoncesDeLogementsASupprimer,
					...annonceDeLogementAMettreAjour,
				], "Immojeune"]);
			});
		});
	});
});
