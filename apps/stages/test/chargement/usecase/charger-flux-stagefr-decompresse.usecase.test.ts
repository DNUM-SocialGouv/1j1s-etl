import { expect, StubbedClass, stubClass } from "@test/configuration";

import { ChargerFluxStagefrDecompresse } from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";

let extension: string;
let nomDuFlux: string;
let flux: FluxChargement;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxStagefrDecompresse;

describe("ChargerFluxStagefrDecompresseTest", () => {
	context("Lorsque je charge le flux Stagefr décompressé", () => {
		beforeEach(() => {
			nomDuFlux = "stagefr-decompresse";
			extension = ".json";

			flux = new FluxChargement(nomDuFlux, extension);

			domainService = stubClass(ChargerOffresDeStageDomainService);
			usecase = new ChargerFluxStagefrDecompresse(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer(flux);

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(flux);
		});
	});
});
