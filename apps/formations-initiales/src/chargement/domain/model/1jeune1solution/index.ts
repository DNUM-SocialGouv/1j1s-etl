export namespace UnJeuneUneSolution {
  export type AttributsFormationInitiale = {
    identifiant: string
    intitule?: string
    duree?: string
    certification?: string
    niveauEtudesVise?: string
    description?: string
    attendusParcoursup?: string
    conditionsAcces?: string
    poursuiteEtudes?: string
    sourceUpdatedAt?: string,
  }

  export type FormationInitialeEnErreur = {
    motif: string
    formationInitiale: FormationInitiale
  }

  export class FormationInitiale {
    public readonly identifiant: string;
    public readonly intitule: string;
    public readonly duree: string;
    public readonly certification?: string;
    public readonly niveauEtudesVise: string;
    public readonly description?: string;
    public readonly attendusParcoursup?: string;
    public readonly conditionsAcces?: string;
    public readonly poursuiteEtudes?: string;

    constructor(attributs: AttributsFormationInitiale) {
      this.identifiant = attributs.identifiant;
      this.intitule = attributs.intitule;
      this.duree = attributs.duree;
      this.certification = attributs.certification;
      this.niveauEtudesVise = attributs.niveauEtudesVise;
      this.description = attributs.description;
      this.attendusParcoursup = attributs.attendusParcoursup;
      this.conditionsAcces = attributs.conditionsAcces;
      this.poursuiteEtudes = attributs.poursuiteEtudes;
    }

    public recupererAttributs(): AttributsFormationInitiale {
      return {
        identifiant: this.identifiant,
        intitule: this.intitule,
        duree: this.duree,
        certification: this.certification,
        niveauEtudesVise: this.niveauEtudesVise,
        description: this.description,
        attendusParcoursup: this.attendusParcoursup,
        conditionsAcces: this.conditionsAcces,
        poursuiteEtudes: this.poursuiteEtudes,
      };
    }
  }

  export class FormationInitialeASauvegarder extends FormationInitiale {
    constructor(attributs: AttributsFormationInitiale) {
      super(attributs);
    }
  }

  export class FormationInitialeASupprimer extends FormationInitiale {
    constructor(
      attributs: AttributsFormationInitiale,
      public readonly id: string
    ) {
      super(attributs);
    }
  }
}
