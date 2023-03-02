import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";
import { Pays } from "@shared/src/domain/service/pays";
import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@shared/test/configuration";

import { TransformerFluxJobteaser } from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Jobteaser } from "@stages/src/transformation/domain/model/jobteaser";
import { Convertir } from "@stages/src/transformation/domain/service/jobteaser/convertir.domain-service";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { OffreDeStageFixtureBuilder } from "@stages/test/transformation/fixture/offre-de-stage.fixture-builder";
import {
	OffreDeStageJobteaserFixtureBuilder,
} from "@stages/test/transformation/fixture/offre-de-stage-jobteaser.fixture-builder";

const dateEcriture = new Date("2022-01-01T00:00:00.000Z");
let resultatTransformation: Array<UnJeune1Solution.OffreDeStage>;
let nomDuFlux: string;
let dossierDHistorisation: string;
let flux: FluxTransformation;

let dateService: StubbedClass<DateService>;
let offreDeStageRepository: StubbedType<OffreDeStageRepository>;
let convertisseurDePays: StubbedType<Pays>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let convertirOffreDeStage: Convertir;
let transformFluxJobteaser: TransformerFluxJobteaser;

describe("TransformerFluxJobteaserTest", () => {
	context("Lorsque je transforme le flux en provenance de jobteaser", () => {
		context("Lorsqu'il n'y a qu'un seul domaine", () => {
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
					domaines: [{ nom: UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE }],
					teletravailPossible: false,
					dureeEnJour: 180,
				})];
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].remunerationBase;
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
				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
				offreDeStageRepository.recuperer.resolves({
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
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.calledOnce;
				expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			});
		});

		context("Lorsqu'il y a plusieurs domaines", () => {
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
					domaines: [
						{ nom: UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE },
						{ nom: UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS },
					],
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

				flux = new FluxTransformation(nomDuFlux, dossierDHistorisation, ".xml", ".json");

				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);

				dateService = stubClass(DateService);
				dateService.maintenant.returns(dateEcriture);

				convertisseurDePays = stubInterface<Pays>(sinon);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");

				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");

				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				offreDeStageRepository.recuperer.resolves({
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
								domain: [Jobteaser.Domaine.AGRONOMIE_BIOLOGIE, Jobteaser.Domaine.MEDIA],
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

				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.called;
			});
		});

		context("Lorsqu'il n'y a pas d'employeur", () => {
			beforeEach(() => {
				dossierDHistorisation = "history";
				nomDuFlux = "source";
				resultatTransformation = [OffreDeStageFixtureBuilder.build({
					description: "\"\n\n\nContenu\n\n",
					employeur: {
						nom: "Nom de l'entreprise",
						logoUrl: "http://url.du.logo",
						siteUrl: "http://site.de.l.entreprise",
					},
					domaines: [
						{ nom: UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE },
						{ nom: UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS },
					],
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

				flux = new FluxTransformation(nomDuFlux, dossierDHistorisation, ".xml", ".json");

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
				const fluxJobteaser = {
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
								domain: [Jobteaser.Domaine.AGRONOMIE_BIOLOGIE, Jobteaser.Domaine.MEDIA],
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
				};
				delete fluxJobteaser.jobs.job[0].company.description;

				offreDeStageRepository.recuperer.resolves(fluxJobteaser);
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.called;
				expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			});
		});

		context("Lorsqu'il n'y a pas de durée renseignée", () => {
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
					domaines: [
						{ nom: UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE },
						{ nom: UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS },
					],
					teletravailPossible: false,
					localisation: {
						ville: "Montpellier",
						codePostal: "34",
						departement: "Hérault",
						region: "Occitanie",
						pays: "FR",
					},
				})];
				delete resultatTransformation[0].dureeEnJour;
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].remunerationBase;
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
				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
				const fluxJobteaser = {
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
								domain: [Jobteaser.Domaine.AGRONOMIE_BIOLOGIE, Jobteaser.Domaine.MEDIA],
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
				};
				delete fluxJobteaser.jobs.job[0].contract?.duration;

				offreDeStageRepository.recuperer.resolves(fluxJobteaser);
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.called;
				expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			});
		});

		context("Lorsqu'il n'y a pas de date de début renseignée", () => {
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
					domaines: [
						{ nom: UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE },
						{ nom: UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS },
					],
					teletravailPossible: false,
					dateDeDebut: dateEcriture.toISOString(),
				})];
				delete resultatTransformation[0].dureeEnJour;
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].remunerationBase;
				delete resultatTransformation[0].teletravailPossible;

				flux = new FluxTransformation(nomDuFlux, dossierDHistorisation, ".xml", ".json");

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
				const fluxJobteaser = {
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
								domain: [Jobteaser.Domaine.AGRONOMIE_BIOLOGIE, Jobteaser.Domaine.MEDIA],
							},
							start_date: undefined,
							contract: {
								duration: {
									amount: "180",
									type: undefined,
								},
								name: "Internship",
							},
						})],
					},
				};
				delete fluxJobteaser.jobs.job[0].contract?.duration;

				offreDeStageRepository.recuperer.resolves(fluxJobteaser);
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.called;
				expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			});
		});

		context("Lorsqu'il n'y a pas de correspondance pour un domaine Jobteaser", () => {
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
					domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
					teletravailPossible: false,
					localisation: {
						ville: "Montpellier",
						codePostal: "34",
						departement: "Hérault",
						region: "Occitanie",
						pays: "FR",
					},
					dateDeDebut: dateEcriture.toISOString(),
				})];
				delete resultatTransformation[0].dureeEnJour;
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].remunerationBase;
				delete resultatTransformation[0].teletravailPossible;

				flux = new FluxTransformation(nomDuFlux, dossierDHistorisation, ".xml", ".json");

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
				const fluxJobteaser = {
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
								domain: ["Wrong value"],
							},
							start_date: undefined,
							contract: {
								duration: {
									amount: "180",
									type: undefined,
								},
								name: "Internship",
							},
						})],
					},
				};
				delete fluxJobteaser.jobs.job[0].contract?.duration;

				offreDeStageRepository.recuperer.resolves(fluxJobteaser);
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.called;
				expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			});
		});

		context("Lorsqu'il y a un type renseigné pour la durée d'un stage", () => {
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
					domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
					teletravailPossible: false,
					localisation: {
						ville: "Montpellier",
						codePostal: "34",
						departement: "Hérault",
						region: "Occitanie",
						pays: "FR",
					},
					dateDeDebut: dateEcriture.toISOString(),
					dureeEnJour: 150,
				})];
				delete resultatTransformation[0].dureeEnJourMax;
				delete resultatTransformation[0].remunerationBase;
				delete resultatTransformation[0].teletravailPossible;

				flux = new FluxTransformation(nomDuFlux, dossierDHistorisation, ".xml", ".json");

				dateService = stubClass(DateService);
				offreDeStageRepository = stubInterface<OffreDeStageRepository>(sinon);
				convertisseurDePays = stubInterface<Pays>(sinon);
				assainisseurDeTexte = stubInterface<AssainisseurDeTexte>(sinon);
				convertirOffreDeStage = new Convertir(dateService, assainisseurDeTexte, convertisseurDePays);
				transformFluxJobteaser = new TransformerFluxJobteaser(offreDeStageRepository, convertirOffreDeStage);

				dateService.maintenant.returns(dateEcriture);
				convertisseurDePays.versFormatISOAlpha2.withArgs("France").returns("FR");
				assainisseurDeTexte.nettoyer.withArgs("<h1>Description de l'entreprise</h1>").returns("Description de l'entreprise\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>Contenu</p>").returns("\"\n\n\nContenu\n\n");
				assainisseurDeTexte.nettoyer.withArgs("Nom de l'entreprise").returns("Nom de l'entreprise");
				const fluxJobteaser = {
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
								domain: ["Wrong value"],
							},
							start_date: undefined,
							contract: {
								duration: {
									amount: "5",
									type: "months",
								},
								name: "Internship",
							},
						})],
					},
				};

				offreDeStageRepository.recuperer.resolves(fluxJobteaser);
			});

			it("je le sauvegarde dans le format attendu", async () => {
				await transformFluxJobteaser.executer(flux);

				expect(offreDeStageRepository.recuperer).to.have.been.called;
				expect(offreDeStageRepository.sauvegarder).to.have.been.calledOnce;
			});
		});
	});
});
