import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { expect } from "@test/configuration";
import { OffreDeStageFixtureBuilder } from "@test/chargement/fixture/offre-de-stage.fixture-builder";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

let nomDuFlux: string;
let offresDeStages: Array<UnJeune1Solution.OffreDeStage>;

let offreDeStageRepository: StubbedType<UnJeune1Solution.OffreDeStageRepository>;
let usecase: ChargerFluxJobteaser;

describe("ChargerFluxJobteaserUsecaseTest", () => {
	context("Lorsque je charge le flux issue de Jobteaser", () => {
		beforeEach(() => {
			nomDuFlux = "jobteaser";
			offresDeStages = [
				OffreDeStageFixtureBuilder.build(),
				OffreDeStageFixtureBuilder.build({
					employeur: undefined,
				}),
			];

			offreDeStageRepository = stubInterface<UnJeune1Solution.OffreDeStageRepository>(sinon);
			usecase = new ChargerFluxJobteaser(offreDeStageRepository);

			offreDeStageRepository.recuperer.resolves(offresDeStages);
		});

		it("Je charge les offres de stage dont on connaît l'employeur", async () => {
			await usecase.executer(nomDuFlux);

			expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
			expect(offreDeStageRepository.recuperer).to.have.been.calledWith(nomDuFlux);

			expect(offreDeStageRepository.charger).to.have.been.calledOnce;
			expect(offreDeStageRepository.charger).to.have.been.calledWith([offresDeStages[0]]);
		});
	});
});
