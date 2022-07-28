import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { StorageClient } from "@shared/gateway/storage.client";
import { TransformFluxJobteaser } from "@transformation/usecase/transform-flux-jobteaser.usecase";
import { ConvertirOffreDeStage } from "@transformation/domain/jobteaser/convertisseur";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { Jobteaser } from "@transformation/domain/jobteaser";

const dateEcriture = new Date("2022-01-01T00:00:00.000Z");
let resultatTransformation: string;
let nomDuFlux: string;
let dossierDHistorisation: string;
let configurationFlux: ConfigurationFlux;

let dateService: StubbedClass<DateService>;
let storageClient: StubbedType<StorageClient>;
let convertirOffreDeStage: ConvertirOffreDeStage;
let transformFluxJobteaser: TransformFluxJobteaser;

describe("TransformFluxJobteaserTest", () => {
	context("Lorsque je transforme le flux en provenance de jobteaser", () => {
		beforeEach(() => {
			dossierDHistorisation = "history";
			nomDuFlux = "source";
			resultatTransformation = JSON.stringify(OffreDeStageFixtureBuilder.build({
				remunerationBase: 0,
				domaines: [UnJeune1Solution.Domaine.NON_APPLICABLE],
				teletravailPossible: false,
			}));
			configurationFlux = {
				dossierHistorisation: dossierDHistorisation,
				nom: nomDuFlux,
				extensionFichierBrut: ".xml",
				extensionFichierJson: ".json",
			};

			dateService = stubClass(DateService);
			storageClient = stubInterface<StorageClient>(sinon);
			convertirOffreDeStage = new ConvertirOffreDeStage(dateService);
			transformFluxJobteaser = new TransformFluxJobteaser(dateService, storageClient, convertirOffreDeStage);

			dateService.maintenant.returns(dateEcriture);
			storageClient.recupererContenu.resolves({ jobs: OffreDeStageJobteaserFixtureBuilder.build() });
		});

		it("je le sauvegarde dans le format attendu", async () => {
			await transformFluxJobteaser.executer(configurationFlux);

			expect(storageClient.recupererContenu).to.have.been.called;
			expect(storageClient.enregistrer).to.have.been.calledTwice;
			expect(JSON.parse(storageClient.enregistrer.getCall(0).args[1])).to.eql(JSON.parse(resultatTransformation));
			expect(storageClient.enregistrer.getCall(0).args).to.have.deep.members([`${nomDuFlux}/${dossierDHistorisation}/${dateEcriture.toISOString()}.json`, resultatTransformation, nomDuFlux]);
			expect(storageClient.enregistrer.getCall(1).args).to.have.deep.members([`${nomDuFlux}/latest.json`, resultatTransformation, nomDuFlux]);
		});
	});
});

export class OffreDeStageFixtureBuilder {
	static build(offreDeStage?: Partial<UnJeune1Solution.OffreDeStage>): UnJeune1Solution.OffreDeStage {
		const defaults: UnJeune1Solution.OffreDeStage = {
			titre: "Titre de l'offre",
			description: "Description de l'offre",
			duree: "Durée",
			dureeEnJour: 90,
			dureeEnJourMax: 180,
			domaines: [UnJeune1Solution.Domaine.NON_APPLICABLE],
			identifiantSource: "Identifiant source",
			remunerationBase: 900,
			sourceCreatedAt: "2022-01-01T00:00:00.000Z",
			sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
			sourcePublishedAt: "2022-01-01T00:00:00.000Z",
			dateDeDebut: "2022-06-01T00:00:00.000Z",
			teletravailPossible: true,
			urlDeCandidature: "http://url.de.candidature.com",
			source: UnJeune1Solution.Source.JOBTEASER,
			employeur: {
				description: "Entreprise leader de son domaine",
				nom: "Nom de l'entreprise",
				logoUrl: "http://url.du.logo",
				siteUrl: "http://site.de.l.entreprise",
			},
			localisation: {
				ville: "Montpellier",
				codePostal: "34",
				departement: "Hérault",
				region: "Occitanie",
				pays: "France",
			},
		};

		return { ...defaults, ...offreDeStage };
	}
}

export class OffreDeStageJobteaserFixtureBuilder {
	static build(offreDeStage?: Partial<Jobteaser.OffreDeStage>): Jobteaser.OffreDeStage {
		const defaults: Jobteaser.OffreDeStage = {
			title: "Titre de l'offre",
			mission: "Description de l'offre",
			company: {
				name: "Nom de l'entreprise",
				description: "Entreprise leader de son domaine",
				logo: "http://url.du.logo",
				domain: "Domaine d'activité de l'entreprise",
				website: "http://site.de.l.entreprise",
			},
			contract: {
				name: "Stage",
				duration: {
					amount: "180",
					type: "day",
				},
			},
			date_created: "2022-01-01T00:00:00.000Z",
			domains: { domain: "Administratif" },
			education: "Niveau d'études",
			expiration_date: "2022-04-01T00:00:00.000Z",
			external_url: "http://url.de.candidature.com",
			languages: {
				language: [{ name: "fr" }, { name: "en" }],
			},
			location: {
				city: "Montpellier",
				zipcode: "34",
				department: "Hérault",
				state: "Occitanie",
				country: "France",
			},
			reference: "Identifiant source",
			start_date: "2022-06-01T00:00:00.000Z",
		};

		return { ...defaults, ...offreDeStage };
	}
}
