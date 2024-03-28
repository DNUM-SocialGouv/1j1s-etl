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
					remunerationMax: 1833,
					remunerationMin: 1750,
					remunerationPeriode: UnJeune1Solution.RemunerationPeriode.MONTHLY,
				})];

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

		context("rémunération", () => {
			it("lorsque la rémunération min et max sont des strings et comportent des virgules, renvoie les champs de rémunération correctement", async () => {
				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					remunerationMax: 156.79,
					remunerationMin: 20.29,
					remunerationPeriode: UnJeune1Solution.RemunerationPeriode.YEARLY,
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
				expect(offreDeStageASauvegarder[0].remunerationMax).to.have.deep.equal(expectedOffreDeStage.remunerationMax);
				expect(offreDeStageASauvegarder[0].remunerationMin).to.have.deep.equal(expectedOffreDeStage.remunerationMin);
				expect(offreDeStageASauvegarder[0].remunerationPeriode).to.have.deep.equal(expectedOffreDeStage.remunerationPeriode);
			});

			it("lorsque la rémunération min et max sont des numbers, renvoie les champs de rémunération correctement", async () => {
				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					remunerationMax: 156,
					remunerationMin: 20,
					remunerationPeriode: UnJeune1Solution.RemunerationPeriode.YEARLY,
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
				expect(offreDeStageASauvegarder[0].remunerationMax).to.have.deep.equal(expectedOffreDeStage.remunerationMax);
				expect(offreDeStageASauvegarder[0].remunerationMin).to.have.deep.equal(expectedOffreDeStage.remunerationMin);
				expect(offreDeStageASauvegarder[0].remunerationPeriode).to.have.deep.equal(expectedOffreDeStage.remunerationPeriode);
			});

			it("lorsque la rémunération min et max ne sont pas fournis, ne renvoie pas les champs de rémunération", async () => {
				const expectedOffreDeStage = OffreDeStageFixtureBuilder.build({
					remunerationMax: undefined,
					remunerationMin: undefined,
					remunerationPeriode: undefined,
				});

				offreDeStageRepository.recuperer.resolves({
					source: {
						job: [OffreDeStageHelloworkFixtureBuilder.build({
							salary_details: {
								salary_max: undefined,
								salary_min: undefined,
								period: UnJeune1Solution.RemunerationPeriode.YEARLY,
							},
						})],
					},
				});

				await transformFluxHellowork.executer(flux);

				const offreDeStageASauvegarder = offreDeStageRepository.sauvegarder.getCall(0).args[0] as Array<UnJeune1Solution.OffreDeStage>;
				expect(offreDeStageASauvegarder[0].remunerationMax).to.have.deep.equal(expectedOffreDeStage.remunerationMin);
				expect(offreDeStageASauvegarder[0].remunerationMax).to.have.deep.equal(expectedOffreDeStage.remunerationMax);
				expect(offreDeStageASauvegarder[0].remunerationPeriode).to.have.deep.equal(expectedOffreDeStage.remunerationPeriode);
			});
		});
	});
});
