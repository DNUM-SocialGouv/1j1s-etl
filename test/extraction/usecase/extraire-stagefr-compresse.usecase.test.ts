import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { ExtraireStagefrCompresse } from "@extraction/usecase/extraire-stagefr-compresse.usecase";
import { Flux } from "@extraction/domain/flux";

const flux: Readonly<Flux> = {
	dossierHistorisation: "history",
	extension: ".xml",
	nom: "stagefr",
	url: "http://some.url",
};
let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireStageFR: ExtraireStagefrCompresse;

describe("ExtraireStageFRcompresseTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireStageFR = new ExtraireStagefrCompresse(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de stagefr en decompresse", () => {
		it("j'extrais le flux", async () => {
			await extraireStageFR.executer({ ...flux });

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(flux);
		});
	});
});
