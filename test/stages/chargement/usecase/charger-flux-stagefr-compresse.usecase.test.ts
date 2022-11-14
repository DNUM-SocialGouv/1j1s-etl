import { ChargerFluxStagefrCompresse } from "@stages/chargement/usecase/charger-flux-stagefr-compresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { expect, StubbedClass, stubClass } from "@test/configuration";

let extension: string;
let nomDuFlux: string;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxStagefrCompresse;

describe("ChargerFluxStagefrCompresseTest", () => {
	context("Lorsque je charge le flux Stagefr décompressé", () => {
		beforeEach(() => {
			nomDuFlux = "stagefr-compresse";
			extension = ".json";

			domainService = stubClass(ChargerOffresDeStageDomainService);
			usecase = new ChargerFluxStagefrCompresse(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer();

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(nomDuFlux, extension);
		});
	});
});
