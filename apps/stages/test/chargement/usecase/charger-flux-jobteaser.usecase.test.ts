import { expect, StubbedClass, stubClass } from "@test/configuration";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";
import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";

let extension: string;
let nomDuFlux: string;
let flux: FluxChargement;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxJobteaser;

describe("ChargerFluxJobteaserTest", () => {
	context("Lorsque je charge le flux Jobteaser", () => {
		beforeEach(() => {
			nomDuFlux = "jobteaser";
			extension = ".json";

			flux = new FluxChargement(nomDuFlux, extension);

			domainService = stubClass(ChargerOffresDeStageDomainService);
			usecase = new ChargerFluxJobteaser(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer(flux);

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(flux);
		});
	});
});