import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/chargement/fixture/annonce-de-logement.fixture-builder";
import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";
import { expect } from "@test/configuration";
import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

let annonceDeLogementRepository: StubbedType<AnnonceDeLogementRepository>;
let chargerFluxImmojeune: ChargerFluxImmojeune;

describe("ChargerFluxImmojeuneTest", () => {
	context("Lorsque je charge le flux Immojeune sur mon dépôt distant", () => {
		beforeEach(() => {
			// Given
			annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
			chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
			annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.returns([]);
			annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.returns([AnnonceDeLogementFixtureBuilder.build()]);
		});

		it("je récupère mon flux", async () => {
			// When
			await chargerFluxImmojeune.executer();

			// Then
			expect(annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees).to.have.been.calledOnce;
		});

		it("je charge mon flux", async () => {
			// When
			await chargerFluxImmojeune.executer();

			// Then
			expect(annonceDeLogementRepository.publier).to.have.been.calledWith([AnnonceDeLogementFixtureBuilder.build()]);
		});

		it("j'enregistre le résultat du chargement", async () => {
			// When

			// Then
		});
	});

	context("Lorsque j'ai des différences entre le flux récupéré d'Immojeune et le contenu existant", () => {
		context("et que j'ai de nouvelles annonces", () => {
			it("je charge ces nouvelles offres", async () => {
				// Given
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
				const nouvellesAnnoncesDeLogement = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "existant" }),
					AnnonceDeLogementFixtureBuilder.build(),
				];
				const annoncesDeLogementExistantes = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "existant" }),
				];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.returns(nouvellesAnnoncesDeLogement);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.returns(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.executer();

				// Then
				expect(annonceDeLogementRepository.publier).to.have.been.calledWith([nouvellesAnnoncesDeLogement[1]]);
				expect(annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees).to.have.been.calledOnce;
			});
		});

		context("et que j'ai des annonces qui ne sont plus présentes", () => {
			it("je supprime ces annonces", async () => {
				// Given
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
				const annoncesDeLogementsNonReferencees = [
					AnnonceDeLogementFixtureBuilder.build(),
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "nouvelle annonce" }),
				];
				const annoncesDeLogementExistantes = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "ancienne" }),
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "a supprimer" }),
					AnnonceDeLogementFixtureBuilder.build(),
				];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.returns(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.returns(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.executer();

				// Then
				expect(annonceDeLogementRepository.supprimer).to.have.been.calledOnceWith([
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "ancienne" }),
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "a supprimer" }),
				]);
			});
		});

		context("et que j'ai des annonces qui ont été mises à jour avec une date explicite plus récente", () => {
			it("je mets à jour ces annonces", async () => {
				// Given
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
				const annoncesDeLogementsNonReferencees = [
					AnnonceDeLogementFixtureBuilder.build(),
					AnnonceDeLogementFixtureBuilder.build({
						identifiantSource: "existante",
						sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
					}),
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "nouvelle annonce" }),
				];
				const annoncesDeLogementExistantes = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "ancienne" }),
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: "a supprimer" }),
					AnnonceDeLogementFixtureBuilder.build(),
					AnnonceDeLogementFixtureBuilder.build({
						identifiantSource: "existante",
						sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
					}),
				];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.returns(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.returns(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.executer();

				// Then
				expect(annonceDeLogementRepository.mettreAJour).to.have.been.calledOnceWith([
					AnnonceDeLogementFixtureBuilder.build({
						identifiantSource: "existante",
						sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
					}),
				]);
			});
		});

		context("et que j'ai des annonces qui sont toujours présentes mais non mises à jour", () => {
			it("je ne fais rien", async () => {
				// Given
				annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(annonceDeLogementRepository);
				const annoncesDeLogementsNonReferencees = [AnnonceDeLogementFixtureBuilder.build()];
				const annoncesDeLogementExistantes = [AnnonceDeLogementFixtureBuilder.build()];
				annonceDeLogementRepository.recupererAnnoncesDeLogementNonReferencees.returns(annoncesDeLogementsNonReferencees);
				annonceDeLogementRepository.recupererAnnoncesDeLogementReferencees.returns(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.executer();

				// Then
				expect(annonceDeLogementRepository.publier).to.have.been.calledOnceWith([]);
				expect(annonceDeLogementRepository.supprimer).to.have.been.calledOnceWith([]);
				expect(annonceDeLogementRepository.mettreAJour).to.have.been.calledOnceWith([]);
			});
		});
	});
});
