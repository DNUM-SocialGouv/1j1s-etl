import { UnJeune1solution } from "@logements/chargement/domain/1jeune1solution";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/chargement/fixture/annonce-de-logement.fixture-builder";
import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";
import { expect } from "@test/configuration";
import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

let repository: StubbedType<AnnonceDeLogementRepository>;
let chargerFluxImmojeune: ChargerFluxImmojeune;

describe("ChargerFluxImmojeuneTest", () => {
	context("Lorsque je charge le flux Immojeune sur mon dépôt distant", () => {
		beforeEach(() => {
			// Given
			repository = stubInterface<AnnonceDeLogementRepository>(sinon);
			chargerFluxImmojeune = new ChargerFluxImmojeune(repository);
			repository.recupererAnnoncesDeLogementReferencees.returns([]);
			repository.recuperer.returns([AnnonceDeLogementFixtureBuilder.build()]);
		});

		it("je récupère mon flux", async () => {
			// When
			await chargerFluxImmojeune.executer();

			// Then
			expect(repository.recuperer).to.have.been.calledOnce;
		});

		it("je charge mon flux", async () => {
			// When
			await chargerFluxImmojeune.executer();

			// Then
			expect(repository.charger).to.have.been.calledWith([AnnonceDeLogementFixtureBuilder.build()]);
		});
	});

	context("Lorsque j'ai des différences entre le flux récupéré d'Immojeune et le contenu existant", () => {
		context("et que j'ai de nouvelles annonces", () => {
			it("je charge ces nouvelles offres", async () => {
				// Given
				repository = stubInterface<AnnonceDeLogementRepository>(sinon);
				chargerFluxImmojeune = new ChargerFluxImmojeune(repository);
				const nouvellesAnnoncesDeLogement = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: 'existant' }),
					AnnonceDeLogementFixtureBuilder.build()
				];
				const annoncesDeLogementExistantes = [
					AnnonceDeLogementFixtureBuilder.build({ identifiantSource: 'existant' })
				];
				repository.recuperer.returns(nouvellesAnnoncesDeLogement);
				repository.recupererAnnoncesDeLogementReferencees.returns(annoncesDeLogementExistantes);

				// When
				await chargerFluxImmojeune.executer();

				// Then
				expect(repository.charger).to.have.been.calledWith([nouvellesAnnoncesDeLogement[1]]);
				expect(repository.recupererAnnoncesDeLogementReferencees).to.have.been.calledOnce;
			});
		})
	});
});
