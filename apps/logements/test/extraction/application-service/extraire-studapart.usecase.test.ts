import { expect, StubbedClass, stubClass } from "@test/configuration";

import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@logements/src/extraction/domain/service/extraire-flux.domain-service";

let flux: FluxExtraction;
let usecase: ExtraireStudapart;
let service: StubbedClass<ExtraireFluxDomainService>;

describe("ExtraireStudarpartUseCaseTest", () => {
	context("Lorsque je souhaite extraire un flux en provenance de Studarpart", () => {
		beforeEach(() => {
			flux = new FluxExtraction("Super flux Studarpart",
				".json",
				"histoire",
				"https://super.url.Studarpart");

			service = stubClass(ExtraireFluxDomainService);

			usecase = new ExtraireStudapart(service);
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
