import { ChargerFluxStagefrDecompresse } from "@chargement/usecase/charger-flux-stagefr-decompresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { expect, StubbedClass, stubClass } from "@test/configuration";

let extension: string;
let nomDuFlux: string;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxStagefrDecompresse;

describe("ChargerFluxStagefrDecompresseTest", () => {
	context("Lorsque je charge le flux Stagefr décompressé", () => {
		beforeEach(() => {
			nomDuFlux = "stagefr-decompresse";
			extension = ".json";

			domainService = stubClass(ChargerOffresDeStageDomainService);
			usecase = new ChargerFluxStagefrDecompresse(domainService);
		});

		it("Je charge ce dernier", async () => {
			await usecase.executer();

			expect(domainService.charger).to.have.been.calledOnce;
			expect(domainService.charger).to.have.been.calledWith(nomDuFlux, extension);
		});
	});
});
