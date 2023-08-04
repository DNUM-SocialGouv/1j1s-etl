import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";

export interface FormationsInitialesChargementRepository {
	chargerLesFormationsInitialesDansLeCMS(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>, nomDuFlux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>>;

	recupererFormationsInitialesASupprimer(flux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASupprimer>>;

	supprimer(formationsInitiales: Array<UnJeuneUneSolution.FormationInitialeASupprimer>, flowName: string): Promise<Array<UnJeuneUneSolution.FormationInitialeEnErreur>>;

	enregistrerDansLeMinio(cheminDuFichier: string, contenu: string, nomDuFlux: string): Promise<void>;

	recupererFormationsInitialesASauvegarder(flux: string): Promise<Array<UnJeuneUneSolution.FormationInitialeASauvegarder>>;
}
