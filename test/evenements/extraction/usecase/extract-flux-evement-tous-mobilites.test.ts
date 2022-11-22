import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@evenements/extraction/domain/services/extraire-flux.domain-service";
import { FluxExtraction } from "@evenements/extraction/domain/flux";
import {
	ExtraireEvenementTousMobilisesUsecase,
} from "@evenements/extraction/usecase/extraire-evenementTousMobilises.usecase";

const flux: FluxExtraction = new FluxExtraction(
	"tousmobilises",
	".json",
	"history",
	"http://some.url",
);

let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireEvenementTousMobilisesUsecase: ExtraireEvenementTousMobilisesUsecase;

describe("ExtraireEvenementTousMobilisesUsecase", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireEvenementTousMobilisesUsecase = new ExtraireEvenementTousMobilisesUsecase(extraireFluxDomainService);
	});

	context("Lorsque j'extrais le flux en provenant de Jobteaser", () => {
		it("j'extrais le flux", async () => {
			await extraireEvenementTousMobilisesUsecase.executer(flux);

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(
				new FluxExtraction(
					"tousmobilises",
					".json",
					"history",
					"http://some.url",
				)
			);
		});
	});
});
