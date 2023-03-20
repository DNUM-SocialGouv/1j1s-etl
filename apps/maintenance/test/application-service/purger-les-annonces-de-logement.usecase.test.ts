import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { AnnonceDeLogementRepository } from "@maintenance/src/domain/service/annonce-de-logement.repository";

const flows = ["immojeune", "studapart"];
let annonceDeLogementRepository: StubbedType<AnnonceDeLogementRepository>;
let usecase: PurgerLesAnnoncesDeLogement;

describe("PurgerLesAnnoncesDeLogementTest", () => {
	beforeEach(() => {
		// Given
		annonceDeLogementRepository = stubInterface<AnnonceDeLogementRepository>(sinon);
		usecase = new PurgerLesAnnoncesDeLogement(annonceDeLogementRepository);
	});

	it("récupère les annonces de logement", async () => {
		// When
		await usecase.executer(flows);

		// Then
		expect(annonceDeLogementRepository.recuperer).to.have.been.calledWith(flows);
	});

	it("supprime les annonces de logement", async () => {
		// Given
		const expectedHousingAds = [
			{ id: "1" },
			{ id: "2" },
		];
		annonceDeLogementRepository.recuperer.withArgs(flows).resolves([
			{ id: "1" },
			{ id: "2" },
		]);

		// When
		await usecase.executer(flows);

		// Then
		expect(annonceDeLogementRepository.supprimer).to.have.been.calledWith(expectedHousingAds);
	});
});
