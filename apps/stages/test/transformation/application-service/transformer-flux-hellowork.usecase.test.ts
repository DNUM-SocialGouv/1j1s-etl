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
let expectedOffreDeStage: Array<UnJeune1Solution.OffreDeStage>;
let nomDuFlux: string;
let dossierDHistorisation: string;
let flux: FluxTransformation;

let dateService: StubbedClass<DateService>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertisseurDePays: StubbedType<Pays>;
let convertirOffreDeStage: Convertir;
let transformFluxHellowork: TransformerFluxHellowork;

describe("TransformerFluxHelloworkTest", () => {
	beforeEach(() => {
		dateService = stubClass(DateService);
		offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
		convertisseurDePays = stubInterface<Pays>(sinon);
		convertirOffreDeStage = new Convertir(dateService, convertisseurDePays);
		transformFluxHellowork = new TransformerFluxHellowork(offreDeStageRepository, convertirOffreDeStage);

		dateService.maintenant.returns(dateEcriture);
		convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");

		dossierDHistorisation = "history";
		nomDuFlux = "source";
		flux = new FluxTransformation(
			nomDuFlux,
			dossierDHistorisation,
			".xml",
			".json",
		);
	});

	context("Lorsque je transforme le flux en provenance de hellowork", () => {
		context("Lorsque tout est renseigné", () => {
			beforeEach(() => {
				expectedOffreDeStage = [OffreDeStageFixtureBuilder.build({
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
					salaireMax: 1833,
					salaireMin: 1750,
					periodeSalaire: UnJeune1Solution.PeriodeSalaire.MONTHLY,
				})];

				delete expectedOffreDeStage[0].remunerationBase;
				delete expectedOffreDeStage[0].dureeEnJour;
				delete expectedOffreDeStage[0].dureeEnJourMax;
				delete expectedOffreDeStage[0].teletravailPossible;

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
							salary_details: {
								salary_max: {
									amount: "1833,00",
								},
								salary_min: {
									amount: "1750,00",
								},
								period: "MONTHLY",
							},
						})],
					},
				});
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxHellowork.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
				expect(offreDeStageRepository.sauvegarder.getCall(0).args).to.have.deep.members([expectedOffreDeStage, flux]);
			});
		});

		context("Lorsque la geolocalisation n'est pas renseigné", () => {
			it("je sauvegarde la localisation sans la longitude et la latitude", async () => {
				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({
							city: "Marseille",
							postalcode: 13000,
							country: "France",
							geoloc: undefined,
						})],
					},
				});

				const offreDeStageExpected = OffreDeStageFixtureBuilder.build({
					localisation: {
						ville: "Marseille",
						codePostal: "13000",
						pays: "FR",
						latitude: undefined,
						longitude: undefined,
					},
				});

				await transformFluxHellowork.executer(flux);

				const offreDeStageASauvegarder = offreDeStageRepository.sauvegarder.getCall(0).args[0] as Array<UnJeune1Solution.OffreDeStage>;
				expect(offreDeStageASauvegarder[0].localisation).to.have.deep.equal(offreDeStageExpected.localisation);
			});
		});

		context("Lorsque le domaine n'est pas renseigné", () => {
			it("je sauvegarde avec le domaine par défaut", async () => {
				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({ seodomain: undefined })],
					},
				});

				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
				});

				await transformFluxHellowork.executer(flux);

				const offreDeStageASauvegarder = offreDeStageRepository.sauvegarder.getCall(0).args[0] as Array<UnJeune1Solution.OffreDeStage>;
				expect(offreDeStageASauvegarder[0].domaines).to.have.deep.equal(expectedOffreDeStage.domaines);
			});
		});

		context("salaire", () => {
			it("lorsque le salaire min et max sont des strings et comportent des virgules, renvoie les champs de salaire correctement", async () => {
				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					salaireMax: 156.79,
					salaireMin: 20.29,
					periodeSalaire: UnJeune1Solution.PeriodeSalaire.YEARLY,
				});

				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({
							salary_details: {
								salary_max: {
									amount: "156,79",
								},
								salary_min: {
									amount: "20,29",
								},
								period: "YEARLY",
							},
						})],
					},
				});

				await transformFluxHellowork.executer(flux);

				const offreDeStageASauvegarder = offreDeStageRepository.sauvegarder.getCall(0).args[0] as Array<UnJeune1Solution.OffreDeStage>;
				expect(offreDeStageASauvegarder[0].salaireMax).to.have.deep.equal(expectedOffreDeStage.salaireMax);
				expect(offreDeStageASauvegarder[0].salaireMin).to.have.deep.equal(expectedOffreDeStage.salaireMin);
				expect(offreDeStageASauvegarder[0].periodeSalaire).to.have.deep.equal(expectedOffreDeStage.periodeSalaire);
			});

			it("lorsque le salaire min et max sont des numbers, renvoie les champs de salaire correctement", async () => {
				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					salaireMax: 156,
					salaireMin: 20,
					periodeSalaire: UnJeune1Solution.PeriodeSalaire.YEARLY,
				});

				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({
							salary_details: {
								salary_max: {
									amount: 156,
								},
								salary_min: {
									amount: 20,
								},
								period: "YEARLY",
							},
						})],
					},
				});

				await transformFluxHellowork.executer(flux);

				const offreDeStageASauvegarder = offreDeStageRepository.sauvegarder.getCall(0).args[0] as Array<UnJeune1Solution.OffreDeStage>;
				expect(offreDeStageASauvegarder[0].salaireMax).to.have.deep.equal(expectedOffreDeStage.salaireMax);
				expect(offreDeStageASauvegarder[0].salaireMin).to.have.deep.equal(expectedOffreDeStage.salaireMin);
				expect(offreDeStageASauvegarder[0].periodeSalaire).to.have.deep.equal(expectedOffreDeStage.periodeSalaire);
			});

			it("lorsque le salaire min et max ne sont pas fournis, ne renvoie pas les champs de salaire", async () => {
				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					salaireMax: undefined,
					salaireMin: undefined,
					periodeSalaire: undefined,
				});

				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({
							salary_details: {
								salary_max: undefined,
								salary_min: undefined,
								period: UnJeune1Solution.PeriodeSalaire.YEARLY,
							},
						})],
					},
				});

				await transformFluxHellowork.executer(flux);

				const offreDeStageASauvegarder = offreDeStageRepository.sauvegarder.getCall(0).args[0] as Array<UnJeune1Solution.OffreDeStage>;
				expect(offreDeStageASauvegarder[0].salaireMax).to.have.deep.equal(expectedOffreDeStage.salaireMin);
				expect(offreDeStageASauvegarder[0].salaireMax).to.have.deep.equal(expectedOffreDeStage.salaireMax);
				expect(offreDeStageASauvegarder[0].periodeSalaire).to.have.deep.equal(expectedOffreDeStage.periodeSalaire);
			});
		});
	});
});
