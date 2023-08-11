import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import { FluxChargement } from "@formations-initiales/src/chargement/domain/model/flux";
import {
	ChargerFormationsInitialesDomainService,
} from "@formations-initiales/src/chargement/domain/service/charger-formations-initiales.domain-service";
import {
	FormationsInitialesRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales.repository";
import {
	FormationInitialeFixtureBuilder,
} from "@formations-initiales/test/chargement/fixture/formation-initiale-fixture.builder";

let nomDuFlux: string;
let extensionDuFichierDeResultat: string;
let flux: FluxChargement;

let formationsInitialesASupprimer: Array<UnJeuneUneSolution.FormationInitialeASupprimer>;
let formationsInitialesASauvegarder: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>;
let formationsInitialesASauvegarderEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>;
let formationsInitialesASupprimerEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>;

let formationsInitialesRepository: StubbedType<FormationsInitialesRepository>;
let domainService: ChargerFormationsInitialesDomainService;

let formationsInitialesSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>;

describe("ChargerFormationsInitialesDomainServiceTest", () => {
	beforeEach(() => {
		nomDuFlux = "onisep";
		extensionDuFichierDeResultat = ".json";

		flux = new FluxChargement(nomDuFlux, extensionDuFichierDeResultat);

		formationsInitialesRepository = stubInterface<FormationsInitialesRepository>(sinon);
		domainService = new ChargerFormationsInitialesDomainService(formationsInitialesRepository);

		formationsInitialesRepository.enregistrerHistoriqueDesFormationsSauvegardees.resolves(Promise<void>);
		formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSauvegardees.resolves(Promise<void>);
		formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSupprimees.resolves(Promise<void>);
	});

	context("Lorsque l'on charge l‘ensemble des formations intiales", () => {
		context("Lorsque le processus de chargement se passe bien", () => {
			beforeEach(() => {
				formationsInitialesASupprimer = [FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer(), FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer({
					identifiant: "id2",
					intitule: "Patissier",
				}, "id2")];
				formationsInitialesASauvegarder = [FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder(), FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder({
					identifiant: "id2",
					intitule: "Patissier a sauvegarder",
				})];

				formationsInitialesASupprimerEnErreur = [];
				formationsInitialesASauvegarderEnErreur = [];

				formationsInitialesRepository.recupererFormationsInitialesASauvegarder.resolves(formationsInitialesASauvegarder);
				formationsInitialesRepository.recupererFormationsInitialesASupprimer.resolves(formationsInitialesASupprimer);
				formationsInitialesRepository.chargerLesFormationsInitiales.resolves({
					formationsInitialesSauvegardees: formationsInitialesASauvegarder,
					formationsInitialesEnErreur: formationsInitialesASauvegarderEnErreur,
				});
				formationsInitialesRepository.supprimer.resolves(formationsInitialesASupprimerEnErreur);
			});

			it("Je charge les formations initiales", async () => {
				await domainService.charger(flux);

				expect(formationsInitialesRepository.recupererFormationsInitialesASauvegarder).to.have.been.calledOnceWithExactly(nomDuFlux);

				expect(formationsInitialesRepository.recupererFormationsInitialesASupprimer).to.have.been.calledOnceWithExactly(nomDuFlux);

				expect(formationsInitialesRepository.supprimer).to.have.been.calledOnceWithExactly(formationsInitialesASupprimer, nomDuFlux);

				expect(formationsInitialesRepository.chargerLesFormationsInitiales).to.have.been.calledOnceWithExactly(formationsInitialesASauvegarder, nomDuFlux);
			});
			it("historise les formations sauvegardées et les formations en erreur", async () => {
				await domainService.charger(flux);

				expect(formationsInitialesRepository.enregistrerHistoriqueDesFormationsSauvegardees).to.have.been.calledOnceWithExactly(formationsInitialesASauvegarder, nomDuFlux);
				expect(formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSauvegardees).to.have.been.calledOnceWithExactly([], nomDuFlux);
				expect(formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSupprimees).to.have.been.calledOnceWithExactly([], nomDuFlux);
			});
		});

		context("Lorsque des formations initiales ne sont pas sauvegardées", () => {
			let formationAvecSauvegardeReussie: UnJeuneUneSolution.FormationInitialeASauvegarder;
			beforeEach(() => {
				formationAvecSauvegardeReussie = FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder();
				const formationNonSauvegardee = FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder({ identifiant: "2" });

				formationsInitialesASupprimer = [
					FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer(formationAvecSauvegardeReussie),
					FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer(formationNonSauvegardee, "id2")];
				formationsInitialesASauvegarder = [
					FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder(),
					FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder(formationNonSauvegardee),
				];

				formationsInitialesASauvegarderEnErreur = [FormationInitialeFixtureBuilder.buildFormationsInitialesEnErreur(formationNonSauvegardee)];
				formationsInitialesASupprimerEnErreur = [];

				formationsInitialesSauvegardees = [formationAvecSauvegardeReussie];

				formationsInitialesRepository.recupererFormationsInitialesASauvegarder.resolves(formationsInitialesASauvegarder);
				formationsInitialesRepository.recupererFormationsInitialesASupprimer.resolves(formationsInitialesASupprimer);
				formationsInitialesRepository.chargerLesFormationsInitiales.resolves({
					formationsInitialesSauvegardees: formationsInitialesSauvegardees,
					formationsInitialesEnErreur: formationsInitialesASauvegarderEnErreur,
				});
				formationsInitialesRepository.supprimer.resolves([]);
			});

			it("historise les formations sauvegardées et les formations en erreur", async () => {
				await domainService.charger(flux);

				expect(formationsInitialesRepository.enregistrerHistoriqueDesFormationsSauvegardees).to.have.been.calledOnceWithExactly(formationsInitialesSauvegardees, nomDuFlux);
				expect(formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSauvegardees).to.have.been.calledOnceWithExactly(formationsInitialesASauvegarderEnErreur, nomDuFlux);
			});
			it("ne supprime pas les formations initiales qui n'ont pas pu être sauvegardées", async () => {
				const seuleFormationASupprimer = FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer(formationAvecSauvegardeReussie);

				await domainService.charger(flux);

				expect(formationsInitialesRepository.supprimer).to.have.been.calledOnceWithExactly([seuleFormationASupprimer], nomDuFlux);
			});
		});
		context("Lorsque des formations initiales ne sont pas supprimées", () => {
			beforeEach(() => {
				const formationInitiale = FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder();
				formationsInitialesASupprimer = [
					FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer(formationInitiale)];
				formationsInitialesASauvegarder = [
					FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder(formationInitiale),
				];

				formationsInitialesSauvegardees = formationsInitialesASauvegarder;
				formationsInitialesASupprimerEnErreur = [FormationInitialeFixtureBuilder.buildFormationsInitialesEnErreur(formationInitiale)];

				formationsInitialesRepository.recupererFormationsInitialesASauvegarder.resolves(formationsInitialesASauvegarder);
				formationsInitialesRepository.recupererFormationsInitialesASupprimer.resolves(formationsInitialesASupprimer);
				formationsInitialesRepository.supprimer.resolves(formationsInitialesASupprimerEnErreur);
				formationsInitialesRepository.chargerLesFormationsInitiales.resolves({
					formationsInitialesSauvegardees: formationsInitialesSauvegardees,
					formationsInitialesEnErreur: formationsInitialesASauvegarderEnErreur,
				});
				});
				it("historise les formations non supprimées", async () => {
					await domainService.charger(flux);

					expect(formationsInitialesRepository.enregistrerHistoriqueDesFormationsNonSupprimees).to.have.been.calledOnceWithExactly(formationsInitialesASupprimerEnErreur, nomDuFlux);
				});
		});
	});
});
