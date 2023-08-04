import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import FormationInitiale = UnJeuneUneSolution.FormationInitiale;

export class FormationsInitialesFixtureBuilder {
	static DEFAULTS_ATTRIBUTS = {
		identifiant: "id",
		intitule: "Boulanger BM",
		duree: "2 ans",
		certification: "3",
		niveauEtudesVise: "Bac + 2",
		description: "description de la formation",
		attendusParcoursup: "L‘option managament d‘unité de production culinaire vise à maîtriser des techniques culinaires propres aux différents types de restauration",
		conditionsAcces: "Le diplomé peut débuter comme chef de partie, second de cuisine, avant d‘accéder à des postes d‘encadrement ou de direction.",
		poursuiteEtudes: "Le BTS est un diplôme conçu pour une insertion professionnelle",
	};
	static DEFAULT_ID = "Identifiant technique";

	static buildFormationsInitialesASauvegarder(formationInitiale?: Partial<UnJeuneUneSolution.FormationInitialeASauvegarder>): UnJeuneUneSolution.FormationInitialeASauvegarder {
		return new UnJeuneUneSolution.FormationInitialeASauvegarder({ ...FormationsInitialesFixtureBuilder.DEFAULTS_ATTRIBUTS, ...formationInitiale });
	}

	static buildFormationsInitialesASupprimer(
		formationInitiale?: Partial<UnJeuneUneSolution.FormationInitialeASupprimer>,
		id?: string,
	): UnJeuneUneSolution.FormationInitialeASupprimer {
		return new UnJeuneUneSolution.FormationInitialeASupprimer(
			{ ...FormationsInitialesFixtureBuilder.DEFAULTS_ATTRIBUTS, ...formationInitiale },
			id || this.DEFAULT_ID,
		);
	}

	static buildFormationsInitialesEnErreur(
		formationInitiale?: Partial<UnJeuneUneSolution.FormationInitiale>,
		motif?: string,
	): UnJeuneUneSolution.FormationInitialeEnErreur {
		return {
			motif: motif ?? "Une erreur est survenue lors de l‘action demandée",
			formationInitiale: new FormationInitiale({ ...FormationsInitialesFixtureBuilder.DEFAULTS_ATTRIBUTS, ...formationInitiale }),
		};
	}
}
