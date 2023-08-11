import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";

export interface FormationsInitialesRepository {
	chargerLesFormationsInitiales(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, nomDuFlux: string): Promise<{
		formationsInitialesSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>,
		formationsInitialesEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>,
	}>;

	recupererFormationsInitialesASupprimer(flux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>>;

	recupererFormationsInitialesASauvegarder(flux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>>;

	supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>>;

	enregistrerHistoriqueDesFormationsSauvegardees(formationsSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, nomDuFlux: string): Promise<void>;

	enregistrerHistoriqueDesFormationsNonSauvegardees(formationsNonSauvegardees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, nomDuFlux: string): Promise<void>;

	enregistrerHistoriqueDesFormationsNonSupprimees(formationsNonSupprimees: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, nomDuFlux: string): Promise<void>;
}
