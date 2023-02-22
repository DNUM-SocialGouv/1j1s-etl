import { expect, StubbedClass, stubClass } from "@test/configuration";

import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";
import { ExtraireStagefrDecompresse } from "@stages/src/extraction/application-service/extraire-stagefr-decompresse.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";

const flux = new FluxExtraction(
	"stagefr",
	".xml",
	"history",
	"http://some.url",
);

let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireStageFR: ExtraireStagefrDecompresse;

describe("ExtraireStagefrDecompresseTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireStageFR = new ExtraireStagefrDecompresse(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de stagefr en decompresse", () => {
		it("j'extrais le flux", async () => {
			await extraireStageFR.executer(flux);

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(
				new FluxExtraction(
					"stagefr",
					".xml",
					"history",
					"http://some.url",
				),
			);
		});
	});
});
