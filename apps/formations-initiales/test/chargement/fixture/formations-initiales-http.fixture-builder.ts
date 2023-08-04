import { FormationInitialeHttp } from "@formations-initiales/src/chargement/infrastructure/gateway/client/http.client";

export class FormationInitialeHttpFixtureBuilder {
  public static build(formationInitialeHttp?: Partial<FormationInitialeHttp>): FormationInitialeHttp {
    const defaults: FormationInitialeHttp = {
      id: "Identifiant technique",
      attributes: {
        identifiant: "id",
      },
    };

    return { ...defaults, ...formationInitialeHttp };
  }
}
