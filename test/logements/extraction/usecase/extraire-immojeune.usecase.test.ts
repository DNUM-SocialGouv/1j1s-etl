import { FluxExtraction } from "@logements/extraction/domain/flux";
import { ExtraireImmojeune } from "@logements/extraction/usecase/extraire-immojeune.usecase";
import { ExtraireFluxDomainService } from "@logements/extraction/domain/services/extraire-flux.domain-service";
import { expect, StubbedClass, stubClass } from "@test/configuration";

let flux: FluxExtraction;
let usecase: ExtraireImmojeune;
let service: StubbedClass<ExtraireFluxDomainService>;

describe("ExtraireImmojeuneTest", () => {
	context("lorsque je souhaite extraire un flux en provenance d'Immojeune", () => {
		beforeEach(() => {
			flux = new FluxExtraction("Super flux immojeune",
				".json",
				"histoire",
				"https://super.url.immojeune");

			service = stubClass(ExtraireFluxDomainService);

			usecase = new ExtraireImmojeune(service);
		});

		it("j'extrais le flux", async () => {
			// When
			await usecase.executer(flux);

			// Then
			expect(service.extraire).to.be.calledOnceWith(
				new FluxExtraction("Super flux immojeune",
					".json",
					"histoire",
					"https://super.url.immojeune"));
		});
	});
});
