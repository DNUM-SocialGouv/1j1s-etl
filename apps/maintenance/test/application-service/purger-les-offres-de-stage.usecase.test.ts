import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";
import { OffreDeStageFixtureBuilder } from "@maintenance/test/fixture/offre-de-stage.fixture-builder";

import { Usecase } from "@shared/src/application-service/usecase";

let internshipRepository: StubbedType<OffreDeStageRepository>;
let purgerLesOffresDeStage: Usecase;
const flows = ["jobteaser", "stagefr-compresse", "stagefr-decompresse"];

describe("PurgerLesOffresDeStageTest", () => {
	beforeEach(() => {
		internshipRepository = stubInterface<OffreDeStageRepository>(sinon);
		purgerLesOffresDeStage = new PurgerLesOffresDeStage(internshipRepository);
	});

	context("Lorsque je souhaites purger les données liées aux stages sur le CMS", () => {
		it("je récupère les offres à supprimer", async () => {
			// Given
			internshipRepository.recuperer.resolves([]);

			// When
			await purgerLesOffresDeStage.executer(flows);

			// Then
			expect(internshipRepository.recuperer).to.have.been.calledWith(flows);
		});

		it("je supprime les offres", async () => {
			// Given
			const internshipsFixture = [OffreDeStageFixtureBuilder.build("1"), OffreDeStageFixtureBuilder.build("2")];

			internshipRepository.recuperer.withArgs(flows).resolves(internshipsFixture);

			// When
			await purgerLesOffresDeStage.executer(flows);

			// Then
			expect(internshipRepository.supprimer).to.have.been.calledOnceWith([
				OffreDeStageFixtureBuilder.build("1"),
				OffreDeStageFixtureBuilder.build("2"),
			]);
		});
	});
});
