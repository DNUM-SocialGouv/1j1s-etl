import { expect, sinon, StubbedType, stubInterface } from "@test/configuration";

import {
	ChargerEvenenementsDomainService,
} from "@evenements/src/chargement/domain/service/charger-evenements.domain-service";
import {
	evenement1Le24Novembre, evenement3Le25Novembre,
	evenement2Le24Novembre, evenement4Le25Novembre,
	evenementDejaCharge1Le24Novembre,
	evenementDejaCharge1Le25Novembre,
	evenementDejaCharge2Le24Novembre, evenementDejaCharge2Le25Novembre,
	evenementLe26Novembre, EvenementUnJeuneUneSolutionFixtureBuilder,
} from "@evenements/test/fixture/evenements-un-jeune-une-solution.fixture";
import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";

describe("ChargerEvenenementsDomainServiceTest", () => {

	context("lorsque je veux charger une liste d'évenements", () => {
		let repository: StubbedType<UnJeuneUneSolution.EvenementsRepository>;
		let service: ChargerEvenenementsDomainService;

		beforeEach(() => {
			repository = stubInterface<UnJeuneUneSolution.EvenementsRepository>(sinon);

			service = new ChargerEvenenementsDomainService(repository);
		});

		context("je recupere les évenements existants puis je veux les évenements à ajouter, à mettre à jour et à supprimer", () => {
			describe("quand je n'ai pas d'évenement existant", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves([]);
					repository.recupererNouveauxEvenementsACharger.resolves([evenement3Le25Novembre, evenement4Le25Novembre]);
					repository.chargerEtEnregistrerLesErreurs.resolves([]);
				});

				it("je charge les nouveaux évenements", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[evenement3Le25Novembre, evenement4Le25Novembre], [], []
					);
				});

			});

			describe("quand j'ai des nouveaux évenements a charger", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]);
					repository.recupererNouveauxEvenementsACharger.resolves([evenement1Le24Novembre, evenement2Le24Novembre, evenement3Le25Novembre, evenement4Le25Novembre]);
					repository.chargerEtEnregistrerLesErreurs.resolves([]);
				});

				it("je charge les nouveaux évenements", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[], [], []
					);
				});
			});

			describe("quand j'ai des nouveaux évenements dans les derniers évenements", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]);
					repository.recupererNouveauxEvenementsACharger.resolves([evenement1Le24Novembre, evenement2Le24Novembre, evenement4Le25Novembre, evenementLe26Novembre]);
					repository.chargerEtEnregistrerLesErreurs.resolves([]);
				});

				it("je mets à jour ces nouveaux évenements", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[],
						[
							EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementAMettreAJour({
								id: 3,
								...evenementLe26Novembre,
							}),
						],
						[]
					);
				});
			});

			describe("quand j'ai des évenements qui n'existe plus dans les derniers évènements", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]);
					repository.recupererNouveauxEvenementsACharger.resolves([evenement3Le25Novembre, evenement4Le25Novembre]);
					repository.chargerEtEnregistrerLesErreurs.resolves([]);
				});

				it("je charge les évenements à supprimer", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith(
						[],
						[],
						[
							EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementASupprimer({ id: 1, ...evenement1Le24Novembre }),
							EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementASupprimer({ id: 2, ...evenement2Le24Novembre }),
						]
					);
				});
			});

			describe("quand j'ai les mêmes évenements a charger que les existants", () => {
				beforeEach(() => {
					repository.recupererEvenementsDejaCharges.resolves([evenement1Le24Novembre, evenement2Le24Novembre]);
					repository.recupererNouveauxEvenementsACharger.resolves([evenement1Le24Novembre, evenement2Le24Novembre]);
					repository.chargerEtEnregistrerLesErreurs.resolves([]);
				});

				it("je ne charge rien", async () => {
					await service.charger("nomFlux");

					expect(repository.chargerEtEnregistrerLesErreurs).to.have.been.calledWith([], [], []);
				});
			});

			context("puis quand tous le chargement c'est bien passé", () => {

				describe("et que j'ai des évènements à ajouter", () => {
					beforeEach(() => {
						repository.recupererEvenementsDejaCharges.resolves([]);
						repository.recupererNouveauxEvenementsACharger.resolves([evenement1Le24Novembre, evenement2Le24Novembre]);
						repository.chargerEtEnregistrerLesErreurs.resolves([]);
					});

					it("j'appelle la sauvegarde sur le minio avec CREATED", async () => {
						await service.charger("nomFlux");

						expect(repository.sauvegarder).to.have.been.calledWith("nomFlux", "CREATED", [evenement1Le24Novembre, evenement2Le24Novembre]);
					});
				});

				describe("et que j'ai des évènements mis à jour", () => {
					beforeEach(() => {
						repository.recupererEvenementsDejaCharges.resolves([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]);
						repository.recupererNouveauxEvenementsACharger.resolves([evenement1Le24Novembre, evenement2Le24Novembre, evenement3Le25Novembre, evenementLe26Novembre]);
						repository.chargerEtEnregistrerLesErreurs.resolves([]);
					});

					it("j'appelle la sauvegarde sur le minio avec UPDATED", async () => {
						await service.charger("nomFlux");

						expect(repository.sauvegarder).to.have.been.calledWith("nomFlux", "UPDATED", 						[
							EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementAMettreAJour({ id: 3, ...evenementLe26Novembre }),
						]);
					});
				});

				describe("et que j'ai des évènements à supprimer", () => {
					beforeEach(() => {
						repository.recupererEvenementsDejaCharges.resolves([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]);
						repository.recupererNouveauxEvenementsACharger.resolves([evenement3Le25Novembre, evenement4Le25Novembre]);
						repository.chargerEtEnregistrerLesErreurs.resolves([]);
					});

					it("j'appelle la sauvegarde sur le minio avec UPDATED", async () => {
						await service.charger("nomFlux");

						expect(repository.sauvegarder).to.have.been.calledWith("nomFlux", "DELETED",
							[
								EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementASupprimer({ id: 1, ...evenement1Le24Novembre }),
								EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementASupprimer({ id: 2, ...evenement2Le24Novembre }),
							]);
					});
				});

				describe("et que j'ai des évènements en erreur lors du chargement", () => {
					beforeEach(() => {
						repository.recupererEvenementsDejaCharges.resolves([]);
						repository.recupererNouveauxEvenementsACharger.resolves([evenement1Le24Novembre, evenement2Le24Novembre]);
						repository.chargerEtEnregistrerLesErreurs.resolves([evenement1Le24Novembre, evenement2Le24Novembre]);
					});

					it("j'appelle la sauvegarde sur le minio avec ERROR", async () => {
						await service.charger("nomFlux");

						expect(repository.sauvegarder).to.have.been.calledWith("nomFlux", "ERROR", [evenement1Le24Novembre, evenement2Le24Novembre]);
					});
				});
			});
		});
	});
});
