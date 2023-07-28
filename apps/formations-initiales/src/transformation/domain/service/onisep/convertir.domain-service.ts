import { UnJeuneUneSolution } from "@formations-initiales//src/transformation/domain/model/1jeune1solution";
import { Onisep } from "@formations-initiales/src/transformation/domain/model/onisep";

export class Convertir {
  public depuisOnisep(formations: Onisep.Contenu): Array<UnJeuneUneSolution.FormationInitiale> {
    return formations.formations.formation.map((formation) => {
      return {
        identifiant: formation.identifiant,
        intitule: formation.libelle_complet,
        duree: formation.duree_formation,
        certification: formation.niveau_certification,
        niveauEtudesVise: formation.niveau_etudes.libelle,
        description: formation.descriptif_format_court,
        attendusParcoursup: formation.attendus,
        conditionsAcces: formation.descriptif_acces,
        poursuiteEtudes: formation.descriptif_poursuite_etudes,
      };
    });
  }
}
