import {
	ChargerEvenenementsDomainService,
} from "@evenements/chargement/domain/1jeune1solution/services/charger-evenements-domain.service";
import { UnjeuneUneSolutionChargement } from "@evenements/chargement/domain/1jeune1solution";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import sinon from "sinon";
import { expect } from "@test/configuration";
import {
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre,
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges,
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt1EvenementLe25Et1EvenementLe26,
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25,
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges,
	aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe25Novembre,
} from "@test/evenements/fixture/tous-mobilises.fixture";

describe("ChargerEvenenementsDomainServiceTest", () => {

	context("lorsque je veux charger une liste d'évenements", () => {
		let repository: StubbedType<UnjeuneUneSolutionChargement.EvenementsRepository>;
		let service: ChargerEvenenementsDomainService;

		beforeEach(() => {
			repository = stubInterface<UnjeuneUneSolutionChargement.EvenementsRepository>(sinon);

			service = new ChargerEvenenementsDomainService(repository);
		});

		context("je recupere les évenements existants puis je veux les évenements à ajouter, à mettre à jour et à supprimer", () => {
			describe("quand je n'ai pas d'évenement existant", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves([]);
					repository.recupererNouveauxEvenementsACharger.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre());
				});

				it("je charge les nouveaux évenements", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[
							{
								dateDebut: "2022-11-24T09:00:00",
								description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
								idSource: "272709",
								lieuEvenement: "Matha",
								modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
								online: false,
								organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
								titreEvenement: "Pôle emploi - Recrutement ADEF+",
								typeEvenement: "job_dating",
								source: "tous-mobilises",
								dateFin: "2022-11-24T12:00:00",
							},
							{
								dateDebut: "2022-11-24T08:30:00",
								description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
								idSource: "272510",
								lieuEvenement: "Clermont",
								modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
								online: false,
								organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
								titreEvenement: "Pôle emploi - LACTALIS",
								typeEvenement: "seance_information",
								source: "tous-mobilises",
								dateFin: "2022-11-24T16:15:00",
							},
						], [], []
					);
				});
				
			});

			describe("quand j'ai des nouveaux évenements a charger", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges());
					repository.recupererNouveauxEvenementsACharger.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25());
				});

				it("je charge les nouveaux évenements", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[
							{
								dateDebut: "2022-11-25T09:30:00",
								dateFin: "2022-11-25T12:00:00",
								description: "Evénement de Recrutement - Jeunes - Café de l'Emploi IAE\n" +
									"de 9h30 à 12h à France Services Audierne",
								idSource: "272739",
								lieuEvenement: "Audierne",
								modaliteInscription: "Inscription auprès de France Services Audierne au 02.98.70.08.78.",
								online: false,
								organismeOrganisateur: "Agence pôle emploi - DOUARNENEZ",
								titreEvenement: "Pôle emploi - Café de l'Emploi IAE",
								typeEvenement: "job_dating",
								source: "tous-mobilises",
							},
							{
								dateDebut: "2022-11-25T10:00:00",
								dateFin: "2022-11-25T12:29:00",
								description: "Evénement de Recrutement - Jeunes - Job dating poste de Vendeur / Vendeuse en prêt-à-porter. Poste en CDI 24H/SEM. Vous travaillez les jeudis, vendredis et samedis.",
								idSource: "274144",
								lieuEvenement: "Lesneven",
								modaliteInscription: "Ce recrutement vous intéresse ! Pour y participer merci d'adresser un mail à recrutement.29061@pole-emploi.fr en précisant vos coordonnées et à l'attention de Mme Fourn",
								online: false,
								organismeOrganisateur: "Agence pôle emploi - LANDERNEAU",
								titreEvenement: "Pôle emploi - Recrutement ",
								typeEvenement: "job_dating",
								source: "tous-mobilises",
							},
						], [], []
					);
				});
			});

			describe("quand j'ai des nouveaux évenements dans les derniers évenements", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges());
					repository.recupererNouveauxEvenementsACharger.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt1EvenementLe25Et1EvenementLe26());
				});

				it("je charge les nouveaux évenements", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[],
						[
							{
								id: 3,
								dateDebut: "2022-11-26T09:30:00",
								dateFin: "2022-11-26T12:00:00",
								description: "Evénement de Recrutement - Jeunes - Café de l'Emploi IAE\n" +
									"de 9h30 à 12h à France Services Audierne",
								idSource: "272739",
								lieuEvenement: "Audierne",
								modaliteInscription: "Inscription auprès de France Services Audierne au 02.98.70.08.78.",
								online: false,
								organismeOrganisateur: "Agence pôle emploi - DOUARNENEZ",
								titreEvenement: "Pôle emploi - Café de l'Emploi IAE",
								typeEvenement: "job_dating",
								source: "tous-mobilises",
							},
						],
						[]
					);
				});
			});

			describe("quand j'ai des évenements qui n'existe plus dans  ", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges());
					repository.recupererNouveauxEvenementsACharger.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe25Novembre());
				});

				it("je charge les évenements à supprimer", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[],
						[],
						aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges()
					);
				});
			});

			describe("quand j'ai les mêmes évenements a charger que les existants", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe25Novembre());
					repository.recupererNouveauxEvenementsACharger.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe25Novembre());
				});

				it("je ne charge rien", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith([], [], []);
				});
			});
		});
	});
});
