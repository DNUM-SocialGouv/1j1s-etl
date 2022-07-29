import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { OffreDeStageFixtureBuilder } from "@test/transformation/usecase/offre-de-stage.fixture-builder";
import {
	OffreDeStageJobteaserFixtureBuilder,
} from "@test/transformation/usecase/offre-de-stage-jobteaser.fixture-builder";
import { StorageClient } from "@shared/gateway/storage.client";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

const dateEcriture = new Date("2022-01-01T00:00:00.000Z");
let resultatTransformation: UnJeune1Solution.OffreDeStage;
let nomDuFlux: string;
let dossierDHistorisation: string;
let configurationFlux: ConfigurationFlux;

let dateService: StubbedClass<DateService>;
let storageClient: StubbedType<StorageClient>;
let correspondanceDomaines: Jobteaser.CorrespondanceDomaine;
let convertirOffreDeStage: Jobteaser.ConvertirOffreDeStage;
let transformFluxJobteaser: TransformerFluxJobteaser;

describe("TransformFluxJobteaserTest", () => {
	context("Lorsque je transforme le flux en provenance de jobteaser", () => {
		beforeEach(() => {
			dossierDHistorisation = "history";
			nomDuFlux = "source";
			resultatTransformation = OffreDeStageFixtureBuilder.build({
				remunerationBase: -1,
				domaines: [UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE],
				teletravailPossible: false,
				duree: "180",
				dureeEnJour: 180,
			});
			delete resultatTransformation.dureeEnJourMax;

			configurationFlux = {
				dossierHistorisation: dossierDHistorisation,
				nom: nomDuFlux,
				extensionFichierBrut: ".xml",
				extensionFichierJson: ".json",
			};

			dateService = stubClass(DateService);
			storageClient = stubInterface<StorageClient>(sinon);
			correspondanceDomaines = new Jobteaser.CorrespondanceDomaine();
			convertirOffreDeStage = new Jobteaser.ConvertirOffreDeStage(dateService, correspondanceDomaines);
			transformFluxJobteaser = new TransformerFluxJobteaser(dateService, storageClient, convertirOffreDeStage);

			dateService.maintenant.returns(dateEcriture);
			storageClient.recupererContenu.resolves({
				jobs: OffreDeStageJobteaserFixtureBuilder.build({
					domains: {
						domain: Jobteaser.Domaine.AGRONOMIE_BIOLOGIE,
					},
				}),
			});
		});

		it("je le sauvegarde dans le format attendu", async () => {
			await transformFluxJobteaser.executer(configurationFlux);

			expect(storageClient.recupererContenu).to.have.been.called;
			expect(storageClient.enregistrer).to.have.been.calledTwice;

			expect(storageClient.enregistrer.getCall(0).args[0]).to.eql(`${nomDuFlux}/${dossierDHistorisation}/${dateEcriture.toISOString()}.json`);
			expect(JSON.parse(storageClient.enregistrer.getCall(0).args[1] as string)).to.eql(resultatTransformation);
			expect(storageClient.enregistrer.getCall(0).args[2]).to.eql(nomDuFlux);

			expect(storageClient.enregistrer.getCall(1).args[0]).to.eql(`${nomDuFlux}/latest.json`);
			expect(JSON.parse(storageClient.enregistrer.getCall(1).args[1] as string)).to.eql(resultatTransformation);
			expect(storageClient.enregistrer.getCall(1).args[2]).to.eql(nomDuFlux);
		});
	});
});

