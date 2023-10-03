import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { DateService } from "@shared/src/domain/service/date.service";
import { Pays } from "@shared/src/domain/service/pays";

import {
	TransformerFluxHellowork,
} from "@stages/src/transformation/application-service/transformer-flux-hellowork.usecase";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Hellowork } from "@stages/src/transformation/domain/model/hellowork";
import { Convertir } from "@stages/src/transformation/domain/service/hellowork/convertir.domain-service";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { OffreDeStageFixtureBuilder } from "@stages/test/transformation/fixture/offre-de-stage.fixture-builder";
import {
	OffreDeStageHelloworkFixtureBuilder,
} from "@stages/test/transformation/fixture/offre-de-stage-hellowork.fixture-builder";
import Source = UnJeune1Solution.Source;

const dateEcriture = new Date("2022-01-01T00:00:00.000Z");
let resultatTransformation: Array<UnJeune1Solution.OffreDeStage>;
let nomDuFlux: string;
let dossierDHistorisation: string;
let flux: FluxTransformation;

let dateService: StubbedClass<DateService>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertisseurDePays: StubbedType<Pays>;
let convertirOffreDeStage: Convertir;
let transformFluxHellowork: TransformerFluxHellowork;
describe("TransformerFluxHelloworkTest", () => {
	context("Lorsque je transforme le flux en provenance de hellowork", () => {
		context("Lorsque tout est renseigné", () => {
			beforeEach(() => {
				dossierDHistorisation = "history";
				nomDuFlux = "source";
				resultatTransformation = [OffreDeStageFixtureBuilder.build({
					description: "Description de l'offre",
					employeur: {
						nom: "Nom de l'entreprise",
						logoUrl: "http://url.du.logo",
					},
					domaines: [{ nom: UnJeune1Solution.Domaine.LOGISTIQUE }],
					identifiantSource: "15788",
					localisation: {
						ville: "Marseille",
						codePostal: "13000",
						pays: "FR",
						latitude: 15.5,
						longitude: 16.78,
					},
					source: Source.HELLOWORK,
					sourceCreatedAt: "2022-01-01T00:00:00.000Z",
					sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
					titre: "Titre de l'offre",
					urlDeCandidature: "https://url-de-candidature.com",
					dateDeDebutMax: undefined,
					dateDeDebutMin: undefined,
				})];

				delete resultatTransformation[0].remunerationBase;
				delete resultatTransformation[0].dureeEnJour;
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].teletravailPossible;

				flux = new FluxTransformation(
					nomDuFlux,
					dossierDHistorisation,
					".xml",
					".json",
				);

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				convertirOffreDeStage = new Convertir(dateService, convertisseurDePays);
				transformFluxHellowork = new TransformerFluxHellowork(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({
							title: "Titre de l'offre",
							description: "Description de l'offre",
							company: "Nom de l'entreprise",
							logo: "http://url.du.logo",
							seodomain: Hellowork.Domaine.LOGISTIQUE,
							date: "2022-01-01T00:00:00.000Z",
							city: "Marseille",
							postalcode: 13000,
							country: "France",
							link: "https://url-de-candidature.com",
							id: 15788,
							geoloc: "15.5,16.78",
						})],
					},
				});
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxHellowork.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
				expect(offreDeStageRepository.sauvegarder.getCall(0).args).to.have.deep.members([resultatTransformation, flux]);
			});
		});

		context("Lorsque la geolocalisation n'est pas renseigné", () => {
			beforeEach(() => {
				dossierDHistorisation = "history";
				nomDuFlux = "source";
				resultatTransformation = [OffreDeStageFixtureBuilder.build({
					dateDeDebutMin: undefined,
					dateDeDebutMax: undefined,
					source: Source.HELLOWORK,
					identifiantSource: "15788",
					localisation: {
						ville: "Marseille",
						codePostal: "13000",
						pays: "FR",
						latitude: undefined,
						longitude: undefined,
					},
				})];

				delete resultatTransformation[0].remunerationBase;
				delete resultatTransformation[0].dureeEnJour;
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].teletravailPossible;
				delete resultatTransformation[0].employeur.description;
				delete resultatTransformation[0].employeur.siteUrl;

				flux = new FluxTransformation(
					nomDuFlux,
					dossierDHistorisation,
					".xml",
					".json",
				);

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				convertirOffreDeStage = new Convertir(dateService, convertisseurDePays);
				transformFluxHellowork = new TransformerFluxHellowork(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				const offreHellowork = OffreDeStageHelloworkFixtureBuilder.build({
					city: "Marseille",
					postalcode: 13000,
					country: "France",
					id: 15788,
				});
				delete offreHellowork.geoloc;
				
				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [offreHellowork],
					},
				});
			});

			it("je le sauvegarde sans la longitude et la latitude", async () => {
				await transformFluxHellowork.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
				expect(offreDeStageRepository.sauvegarder.getCall(0).args).to.have.deep.members([resultatTransformation, flux]);
			});
		});

		context("Lorsque le domaine n'est pas renseigné", () => {
			beforeEach(() => {
				dossierDHistorisation = "history";
				nomDuFlux = "source";
				resultatTransformation = [OffreDeStageFixtureBuilder.build({
					dateDeDebutMin: undefined,
					dateDeDebutMax: undefined,
					source: Source.HELLOWORK,
					domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
					identifiantSource: "15788",
				}, {
					latitude: undefined,
					longitude: undefined,
				})];

				delete resultatTransformation[0].remunerationBase;
				delete resultatTransformation[0].dureeEnJour;
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].teletravailPossible;
				delete resultatTransformation[0].employeur.description;
				delete resultatTransformation[0].employeur.siteUrl;
				delete resultatTransformation[0].localisation.region;
				delete resultatTransformation[0].localisation.departement;

				flux = new FluxTransformation(
					nomDuFlux,
					dossierDHistorisation,
					".xml",
					".json",
				);

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				convertirOffreDeStage = new Convertir(dateService, convertisseurDePays);
				transformFluxHellowork = new TransformerFluxHellowork(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				const offreHellowork = OffreDeStageHelloworkFixtureBuilder.build();
				delete offreHellowork.geoloc;
				delete offreHellowork.seodomain;

				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [offreHellowork],
					},
				});
			});

			it("je le sauvegarde avec le domaine par défaut", async () => {
				await transformFluxHellowork.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
				expect(offreDeStageRepository.sauvegarder.getCall(0).args[0]).to.have.deep.members(resultatTransformation);
			});
		});
	});
});
