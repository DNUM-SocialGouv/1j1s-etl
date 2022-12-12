import { FluxExtraction } from "@logements/extraction/domain/flux";
import { ExtraireFluxDomainService } from "@logements/extraction/domain/services/extraire-flux.domain-service";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireStudapartUseCase } from "@logements/extraction/usecase/extraire-studapart.usecase";

let flux: FluxExtraction;
let usecase: ExtraireStudapartUseCase;
let service: StubbedClass<ExtraireFluxDomainService>;

describe("ExtraireStudarpartUseCaseTest", () => {
	context("Lorsque je souhaite extraire un flux en provenance de Studarpart", () => {
		beforeEach(() => {
			flux = new FluxExtraction("Super flux Studarpart",
				".json",
				"histoire",
				"https://super.url.Studarpart");

			service = stubClass(ExtraireFluxDomainService);

			usecase = new ExtraireStudapartUseCase(service);
		});

		it("j'extrais le flux", async () => {
			// When
			await usecase.executer(flux);

			// Then
			expect(service.extraire).to.be.calledOnceWith(
				new FluxExtraction("Super flux Studarpart",
					".json",
					"histoire",
					"https://super.url.Studarpart"));
		});
	});
});
