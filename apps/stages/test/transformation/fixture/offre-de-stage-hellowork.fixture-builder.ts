import { Hellowork } from "@stages/src/transformation/domain/model/hellowork";

export class OffreDeStageHelloworkFixtureBuilder {
	public static build(
		offreDeStage?: Partial<Hellowork.OffreDeStage>,
	): Hellowork.OffreDeStage {
		return {
			title: "Titre de l'offre",
			description: "Description de l'offre",
			compagny: "Nom de l'entreprise",
			logo: "http://url.du.logo",
			seodomain: Hellowork.Domaine.NULL,
			date: "2022-01-01T00:00:00.000Z",
			city: "Montpellier",
			postalcode: "34",
			country: "France",
			link: "http://url.de.candidature.com",
			id: "Identifiant source",
			geoloc: "15.5,16.78",
			salary: "1000-2000 EUR par mois",
			...offreDeStage,
		};
	}
}
