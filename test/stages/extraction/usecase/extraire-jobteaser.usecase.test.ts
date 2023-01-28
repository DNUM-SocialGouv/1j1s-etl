import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@stages/extraction/domain/service/extraire-flux.domain-service";
import { ExtraireJobteaser } from "@stages/extraction/application-service/extraire-jobteaser.usecase";
import { FluxExtraction } from "@stages/extraction/domain/model/flux";

const flux: FluxExtraction = new FluxExtraction(
	"jobteaser",
	".xml",
	"history",
	"http://some.url",
);

let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireJobteaser: ExtraireJobteaser;

describe("ExtraireJobteaserTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireJobteaser = new ExtraireJobteaser(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de Jobteaser", () => {
		it("j'extrais le flux", async () => {
			await extraireJobteaser.executer(flux);

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(
				new FluxExtraction(
					"jobteaser",
					".xml",
					"history",
					"http://some.url",
				),
			);
		});
	});
});
