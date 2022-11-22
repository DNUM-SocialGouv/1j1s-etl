import { ChargerFluxStagefrCompresse } from "@stages/chargement/usecase/charger-flux-stagefr-compresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { FluxChargement } from "@stages/chargement/domain/1jeune1solution/flux";

let extension: string;
let nomDuFlux: string;
let flux: FluxChargement;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxStagefrCompresse;

describe("ChargerFluxStagefrCompresseTest", () => {
	context("Lorsque je charge le flux Stagefr décompressé", () => {
		beforeEach(() => {
			nomDuFlux = "stagefr-compresse";
			extension = ".json";

			flux = new FluxChargement(nomDuFlux, extension);

			domainService = stubClass(ChargerOffresDeStageDomainService);
			usecase = new ChargerFluxStagefrCompresse(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer(flux);

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(flux);
		});
	});
});
