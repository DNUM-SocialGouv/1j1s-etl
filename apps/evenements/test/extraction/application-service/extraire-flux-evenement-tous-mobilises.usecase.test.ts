import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ExtraireFluxDomainService } from "@evenements/src/extraction/domain/service/extraire-flux.domain-service";
import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { FluxExtraction } from "@evenements/src/extraction/domain/model/flux";

const flux: FluxExtraction = new FluxExtraction(
	"tousmobilises",
	".json",
	"history",
	"http://some.url",
);

let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireEvenementTousMobilisesUsecase: ExtraireFluxEvenementTousMobilises;

describe("ExtraireEvenementTousMobilises", () => {
	beforeEach(() => {
		extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
		extraireEvenementTousMobilisesUsecase = new ExtraireFluxEvenementTousMobilises(extraireFluxDomainService);
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
				),
			);
		});
	});
});
