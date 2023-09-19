import { expect, StubbedClass, stubClass } from "@test/library";

import { ExtraireHellowork } from "@stages/src/extraction/application-service/extraire-hellowork.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";

const flux: FluxExtraction = new FluxExtraction(
	"hellowork",
	".xml",
	"history",
	"http://some.url",
);

let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireHellowork: ExtraireHellowork;

describe("ExtraireHelloworkTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireHellowork = new ExtraireHellowork(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de Hellowork", () => {
		it("j'extrais le flux", async () => {
			await extraireHellowork.executer(flux);

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(
				new FluxExtraction(
					"hellowork",
					".xml",
					"history",
					"http://some.url",
				),
			);
		});
	});
});
