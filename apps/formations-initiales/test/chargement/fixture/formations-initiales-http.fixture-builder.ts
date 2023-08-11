import {
  FormationInitialeStrapiExtrait,
} from "@formations-initiales/src/chargement/infrastructure/gateway/client/strapi-formations-initiales.httpClient";

export class FormationInitialeStrapiFixtureBuilder {
  public static build(formationInitialeStrapi?: Partial<FormationInitialeStrapiExtrait>): FormationInitialeStrapiExtrait {
    const defaults: FormationInitialeStrapiExtrait = {
      id: "Identifiant technique",
      attributes: {
        identifiant: "id",
      },
    };

    return { ...defaults, ...formationInitialeStrapi };
  }
}
