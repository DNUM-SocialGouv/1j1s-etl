import { expect, StubbedClass, stubClass } from "@test/library";

import { ChargerFluxOnisep } from "@formations-initiales/src/chargement/application-service/charger-flux-onisep.usecase";
import { FluxChargement } from "@formations-initiales/src/chargement/domain/model/flux";
import {
	ChargerFormationsInitialesDomainService,
} from "@formations-initiales/src/chargement/domain/service/charger-formations-initiales.domain-service";

let extension: string;
let nomDuFlux: string;
let flux: FluxChargement;

let domainService: StubbedClass<ChargerFormationsInitialesDomainService>;
let usecase: ChargerFluxOnisep;

describe("ChargerFluxOnisepTest", () => {
	context("Lorsque je charge le flux Onisep", () => {
		beforeEach(() => {
			nomDuFlux = "onisep";
			extension = ".json";

			flux = new FluxChargement(nomDuFlux, extension);

			domainService = stubClass(ChargerFormationsInitialesDomainService);
			usecase = new ChargerFluxOnisep(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer(flux);

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(flux);
		});
	});
});
