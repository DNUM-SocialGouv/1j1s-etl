import { AnnonceDeLogementHttp } from "@logements/chargement/infrastructure/gateway/client/http.client";

export class AnnonceDeLogementHttpFixtureBuilder {
	public static build(annonceDeLogementHttp?: Partial<AnnonceDeLogementHttp>): AnnonceDeLogementHttp {
		const defaults: AnnonceDeLogementHttp = {
			id: "0",
			attributes: {
				identifiantSource: "identifiant-source",
				sourceUpdatedAt: "2023-01-01T00:00:00.000Z",
			},
		};

		return { ...defaults, ...annonceDeLogementHttp };
	}
}
