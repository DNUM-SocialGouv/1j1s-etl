import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@stages/extraction/domain/services/extraire-flux.domain-service";
import { ExtraireStagefrCompresse } from "@stages/extraction/usecase/extraire-stagefr-compresse.usecase";
import { FluxExtraction } from "@stages/extraction/domain/flux";

const flux = new FluxExtraction(
	"stagefr",
	".xml",
	"history",
	"http://some.url",
);

let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireStageFR: ExtraireStagefrCompresse;

describe("ExtraireStageFRcompresseTest", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireStageFR = new ExtraireStagefrCompresse(extraireFluxDomainService);
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
				)
			);
		});
	});
});
