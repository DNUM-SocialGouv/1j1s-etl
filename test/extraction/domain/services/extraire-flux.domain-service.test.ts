import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { DateService } from "@shared/date.service";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { Flux } from "@extraction/domain/flux";
import { FluxClient } from "@extraction/domain/flux.client";
import { StorageClient } from "@extraction/domain/storage.client";

const date = new Date("2022-01-01T00:00:00Z");
const fluxContent = "<toto>Le Contenu</toto>";
let flux: Flux;
let fluxClient: StubbedType<FluxClient>;
let storageClient: StubbedType<StorageClient>;
let dateService: StubbedClass<DateService>;
let usecase: ExtraireFluxDomainService;

describe("ExtraireFluxTest", () => {
	beforeEach(() => {
		fluxClient = stubInterface(sinon);
		fluxClient.recuperer.resolves(fluxContent);
		storageClient = stubInterface(sinon);
		dateService = stubClass(DateService);
		dateService.maintenant.returns(new Date(date));
		usecase = new ExtraireFluxDomainService(
			fluxClient,
			storageClient,
			dateService
		);

		flux = {
			dossierHistorisation: "history",
			extension: ".xml",
			nom: "jobteaser",
			url: "http://some.url",
		};
	});

	context("Lorsque j'extrais un flux avec la bonne configuration", () => {
		it("je stocke le flux extrait", async () => {
			const { nom, dossierHistorisation, extension, url } = flux;

			await usecase.extraire(flux);

			expect(fluxClient.recuperer).to.have.been.calledOnce;
			expect(fluxClient.recuperer).to.have.been.calledWith(url);
			expect(storageClient.enregistrer).to.have.been.calledTwice;
			expect(storageClient.enregistrer.getCall(0).args).to.have.deep.members([
				`${nom}/${dossierHistorisation}/${date.toISOString()}${extension}`,
				fluxContent,
				"jobteaser",
			]);
			expect(storageClient.enregistrer.getCall(1).args)
				.to.have.deep.members(["jobteaser/latest.xml", fluxContent, "jobteaser"]);
		});
	});

	context("Lorsque j'extrais un flux mais qui n'existe pas", () => {
		beforeEach(() => {
			fluxClient.recuperer.rejects(new Error("Oops! Something went wrong :-("));
		});

		it("je laisse passer les erreurs", async () => {
			await expect(usecase.extraire(flux)).to.be.rejectedWith(
				Error,
				"Oops! Something went wrong :-("
			);
		});
	});
});
