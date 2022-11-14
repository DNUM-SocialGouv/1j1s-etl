import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@stages/extraction/domain/services/extraire-flux.domain-service";
import { ExtraireStagefrDecompresse } from "@stages/extraction/usecase/extraire-stagefr-decompresse.usecase";
import { Flux } from "@stages/extraction/domain/flux";

const flux: Readonly<Flux> = {
	dossierHistorisation: "history",
	extension: ".xml",
	nom: "stagefr",
	url: "http://some.url",
};
let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireStageFR: ExtraireStagefrDecompresse;

describe("ExtraireStagefrDecompresseTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireStageFR = new ExtraireStagefrDecompresse(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de stagefr en decompresse", () => {
		it("j'extrais le flux", async () => {
			await extraireStageFR.executer({ ...flux });

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(flux);
		});
	});
});
