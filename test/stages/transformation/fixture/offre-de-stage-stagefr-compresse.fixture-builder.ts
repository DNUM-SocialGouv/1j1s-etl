import { StagefrCompresse } from "@stages/transformation/domain/stagefr-compresse";

export class OffreDeStageStagefrCompresseFixtureBuilder {
	static build(offreDeStage?: Partial<StagefrCompresse.OffreDeStage>): StagefrCompresse.OffreDeStage {
		const defaults = {
			title: "Titre de l'offre",
			employer: "Nom de l'entreprise",
			description: "Description de l'offre",
			post_date: "2022-01-01T00:00:00.000Z",
			url: "http://url.de.candidature.com",
			logo: "http://url.du.logo",
			cpc: "",
			guid: 100,
			salary: "900",
			contract_time: "90",
			location: {
				location: "Montpellier",
				country: "fr",
				location_raw: "34",
				location_parent: "france",
				geo_lng: 30,
				geo_lat: 10,
			},
			category: "cuisine",
			contract_type: "stage",
		};

		return { ...defaults, ...offreDeStage };
	}
}
