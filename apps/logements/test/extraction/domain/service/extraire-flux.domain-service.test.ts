import { DateService } from "@shared/src/date.service";
import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/configuration";
import { ExtraireFluxDomainService } from "@logements/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { FluxRepository } from "@logements/src/extraction/domain/service/flux.repository";

const date = new Date("2022-01-01T00:00:00Z");
const fluxContent = "<toto>Le Contenu</toto>";
let flux: FluxExtraction;
let service: ExtraireFluxDomainService;
let repository: StubbedType<FluxRepository>;
let dateService: StubbedClass<DateService>;

describe("ExtraireFluxTest", () => {
	context("lorsque je veux extraire un flux", () => {
		beforeEach(() => {
			flux = new FluxExtraction("immojeune",
				".json",
				"histoire",
				"https://super.url.immojeune");

			repository = stubInterface(sinon);
			repository.recuperer.resolves(fluxContent);

			dateService = stubClass(DateService);
			dateService.maintenant.returns(date);

			service = new ExtraireFluxDomainService(repository, dateService);
		});

		it("j'extrais le flux", async () => {
			// Given
			const { nom, dossierHistorisation, extension, url } = flux;

			// When
			await service.extraire(flux);

			// Then
			expect(repository.recuperer).to.be.calledOnceWith(flux);
			expect(repository.enregistrer.getCall(0).args).to.have.deep.members([
				`${nom}/${dossierHistorisation}/${date.toISOString()}${extension}`,
				fluxContent,
				{ nom, dossierHistorisation, extension, url }]);
			expect(repository.enregistrer.getCall(1).args).to.have.deep.members(["immojeune/latest.json", fluxContent, {
				nom,
				url,
				extension,
				dossierHistorisation,
			}]);
		});
	});
});
