import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@stages/extraction/domain/services/extraire-flux.domain-service";
import { ExtraireJobteaser } from "@stages/extraction/usecase/extraire-jobteaser.usecase";
import { Flux } from "@stages/extraction/domain/flux";

const flux: Readonly<Flux> = {
	dossierHistorisation: "history",
	extension: ".xml",
	nom: "jobteaser",
	url: "http://some.url",
};
let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireJobteaser: ExtraireJobteaser;

describe("ExtraireJobteaserTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireJobteaser = new ExtraireJobteaser(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de Jobteaser", () => {
		it("j'extrais le flux", async () => {
			await extraireJobteaser.executer({ ...flux });

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(flux);
		});
	});
});
