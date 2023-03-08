import { expect, StubbedClass, stubClass } from "@test/library";

import {
	ExtraireStagefrCompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-compresse.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";

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
				),
			);
		});
	});
});
