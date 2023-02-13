import { StagefrDecompresse } from "@stages/src/transformation/domain/model/stagefr-decompresse";

export class OffreDeStageStagefrDecompresseFixtureBuilder {
	static build(offreDeStage?: Partial<StagefrDecompresse.OffreDeStage>): StagefrDecompresse.OffreDeStage {
		const defaults = {
			jobid: "Identifiant source",
			title: "Titre de l'offre",
			company: "Nom de l'entreprise",
			city: "Montpellier",
			state: "Occitanie",
			country: "fr",
			description: "Description de l'offre",
			date: "2022-01-01T00:00:00.000Z",
			url: "http://url.de.candidature.com",
			logo: "http://url.du.logo",
		};

		return { ...defaults, ...offreDeStage };
	}
}
