import { expect, StubbedClass, stubClass } from "@test/configuration";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { ChargerFluxJobteaser } from "@stages/chargement/usecase/charger-flux-jobteaser.usecase";

let extension: string;
let nomDuFlux: string;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxJobteaser;

describe("ChargerFluxJobteaserTest", () => {
	context("Lorsque je charge le flux Jobteaser", () => {
		beforeEach(() => {
			nomDuFlux = "jobteaser";
			extension = ".json";

			domainService = stubClass(ChargerOffresDeStageDomainService);
			usecase = new ChargerFluxJobteaser(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer();

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(nomDuFlux, extension);
		});
	});
});
