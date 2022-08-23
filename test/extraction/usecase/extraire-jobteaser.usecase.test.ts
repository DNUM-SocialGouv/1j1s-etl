import { ConfigurationFlux } from "@extraction/domain/configuration-flux";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { ExtraireJobteaser } from "@extraction/usecase/extraire-jobteaser.usecase";

const configurationFlux: Readonly<ConfigurationFlux> = {
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
			await extraireJobteaser.executer({ ...configurationFlux });

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(configurationFlux);
		});
	});
});
