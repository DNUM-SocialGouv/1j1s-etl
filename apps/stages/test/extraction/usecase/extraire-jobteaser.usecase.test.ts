import { expect, StubbedClass, stubClass } from "@test/library";

import { ExtraireJobteaser } from "@stages/src/extraction/application-service/extraire-jobteaser.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";

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
