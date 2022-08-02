import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { ConvertisseurPays } from "@shared/convertisseur-pays";
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
let resultatTransformation: Array<UnJeune1Solution.OffreDeStage>;
let nomDuFlux: string;
let dossierDHistorisation: string;
let configurationFlux: ConfigurationFlux;

let dateService: StubbedClass<DateService>;
let storageClient: StubbedType<StorageClient>;
let convertisseurDePays: StubbedType<ConvertisseurPays>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let convertirOffreDeStage: Jobteaser.Convertir;
let transformFluxJobteaser: TransformerFluxJobteaser;

describe("TransformerFluxJobteaserTest", () => {
	context("Lorsque je transforme le flux en provenance de jobteaser", () => {
		beforeEach(() => {
			dossierDHistorisation = "history";
			nomDuFlux = "source";
			resultatTransformation = [OffreDeStageFixtureBuilder.build({
				description: "\"\n\n\nContenu\n\n",
				employeur: {
					description: "Description de l'entreprise\n===========================",
					nom: "Nom de l'entreprise",
					logoUrl: "http://url.du.logo",
					siteUrl: "http://site.de.l.entreprise",
				},
				domaines: [UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE],
				teletravailPossible: false,
				dureeEnJour: 180,
				localisation: {
					ville: "Montpellier",
					codePostal: "34",
					departement: "Hérault",
					region: "Occitanie",
					pays: "FR",
				},
			})];
			delete resultatTransformation[0].dureeEnJourMax;
			delete resultatTransformation[0].remunerationBase;
			delete resultatTransformation[0].teletravailPossible;

			configurationFlux = {
				dossierHistorisation: dossierDHistorisation,
				nom: nomDuFlux,
				extensionFichierBrut: ".xml",
				extensionFichierJson: ".json",
			};

			dateService = stubClass(DateService);
			storageClient = stubInterface<StorageClient>(sinon);
			convertisseurDePays = stubInterface<ConvertisseurPays>(sinon);
			assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
			convertirOffreDeStage = new Jobteaser.Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
			transformFluxJobteaser = new TransformerFluxJobteaser(dateService, storageClient, convertirOffreDeStage);

			dateService.maintenant.returns(dateEcriture);
			convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
			assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
			assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
			storageClient.recupererContenu.resolves({
				jobs: {
					job: [OffreDeStageJobteaserFixtureBuilder.build({
						mission: "<p>Contenu</p>",
						company: {
							description: "<h1>Description de l'entreprise</h1>",
							name: "Nom de l'entreprise",
							logo: "http://url.du.logo",
							domain: "Domaine d'activité de l'entreprise",
							website: "http://site.de.l.entreprise",
						},
						domains: {
							domain: Jobteaser.Domaine.AGRONOMIE_BIOLOGIE,
						},
						contract: {
							duration: {
								amount: "180",
								type: undefined,
							},
							name: "Internship",
						},
					})],
				},
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

