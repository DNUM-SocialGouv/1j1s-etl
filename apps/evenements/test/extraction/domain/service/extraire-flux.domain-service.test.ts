import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { FluxExtraction } from "@evenements/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@evenements/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxRepository } from "@evenements/src/extraction/domain/service/flux.repository";

import { DateService } from "@shared/src/domain/service/date.service";

const date = new Date("2022-01-01T00:00:00Z");
const fluxContent = "<toto>Le Contenu</toto>";
let flux: FluxExtraction;
let fluxRepository: StubbedType<FluxRepository>;
let dateService: StubbedClass<DateService>;
let usecase: ExtraireFluxDomainService;

describe("ExtraireFluxTest", () => {
	beforeEach(() => {
		fluxRepository = stubInterface(sinon);
		fluxRepository.recuperer.resolves(fluxContent);
		dateService = stubClass(DateService);
		dateService.maintenant.returns(new Date(date));
		usecase = new ExtraireFluxDomainService(
			fluxRepository,
			dateService,
		);

		flux = new FluxExtraction(
			"tousmobilises",
			".json",
			"history",
			"http://some.url",
		);
	});

	context("Lorsque j'extrais un flux avec la bonne configuration", () => {
		it("je stocke le flux extrait", async () => {
			const { nom, dossierHistorisation, extension, url } = flux;

			await usecase.extraire(flux);

			expect(fluxRepository.recuperer).to.have.been.calledOnce;
			expect(fluxRepository.recuperer).to.have.been.calledWith(flux);
			expect(fluxRepository.enregistrer).to.have.been.calledTwice;
			expect(fluxRepository.enregistrer.getCall(0).args).to.have.deep.members([
				`${nom}/${dossierHistorisation}/${date.toISOString()}${extension}`,
				fluxContent,
				{ nom, url, extension, dossierHistorisation },
			]);
			expect(fluxRepository.enregistrer.getCall(1).args)
				.to.have.deep.members(["tousmobilises/latest.json", fluxContent, {
				nom,
				url,
				extension,
				dossierHistorisation,
			}]);
		});
	});

	context("Lorsque j'extrais un flux mais qui n'existe pas", () => {
		beforeEach(() => {
			fluxRepository.recuperer.rejects(new Error("Oops! Something went wrong :-("));
		});

		it("je laisse passer les erreurs", async () => {
			await expect(usecase.extraire(flux)).to.be.rejectedWith(
				Error,
				"Oops! Something went wrong :-(",
			);
		});
	});
});
