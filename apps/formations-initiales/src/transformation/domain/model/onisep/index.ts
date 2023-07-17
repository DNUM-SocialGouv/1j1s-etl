export namespace Onisep {
  export type Contenu = {
    formations: { formation: Array<Formation> }
  }
  export type Formation = {
    identifiant: string
    libelle_complet: string
    duree_formation: string
    niveau_certification: string
    niveau_etudes: { libelle: string }
    descriptif_format_court: string
    attendus: string
    descriptif_acces: string
    descriptif_poursuite_etudes: string
  }
}
