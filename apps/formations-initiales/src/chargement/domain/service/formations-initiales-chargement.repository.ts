import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";

export interface FormationsInitialesChargementRepository {
	chargerLesFormationsInitialesDansLeCMS(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, nomDuFlux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>>;

	recupererFormationsInitialesASupprimer(flux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>>;

	recupererFormationsInitialesASauvegarder(flux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>>;

	supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>>;

	enregistrerHistoriqueDesFormationsEnErreur(formationsASauvegarderEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, formationsASupprimerEnErreur: Array<UnJeuneUneSolution.FormationInitialeEnErreur>, nomDuFlux: string): Promise<void>;

	enregistrerHistoriqueDesFormationsSauvegardees(formationsSauvegardees: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, nomDuFlux: string): Promise<void>;
}
