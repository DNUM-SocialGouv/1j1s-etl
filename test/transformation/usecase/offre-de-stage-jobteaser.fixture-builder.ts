import { Jobteaser } from "@transformation/domain/jobteaser";

export class OffreDeStageJobteaserFixtureBuilder {
	static build(offreDeStage?: Partial<Jobteaser.OffreDeStage>): Jobteaser.OffreDeStage {
		const defaults: Jobteaser.OffreDeStage = {
			title: "Titre de l'offre",
			mission: "Description de l'offre",
			company: {
				name: "Nom de l'entreprise",
				description: "Entreprise leader de son domaine",
				logo: "http://url.du.logo",
				domain: "Domaine d'activité de l'entreprise",
				website: "http://site.de.l.entreprise",
			},
			contract: {
				name: "Stage",
				duration: {
					amount: "180",
					type: "day",
				},
			},
			date_created: "2022-01-01T00:00:00.000Z",
			domains: { domain: "Administratif" },
			education: "Niveau d'études",
			expiration_date: "2022-04-01T00:00:00.000Z",
			external_url: "http://url.de.candidature.com",
			languages: {
				language: [{ name: "fr" }, { name: "en" }],
			},
			location: {
				city: "Montpellier",
				zipcode: "34",
				department: "Hérault",
				state: "Occitanie",
				country: "France",
			},
			reference: "Identifiant source",
			start_date: "2022-06-01T00:00:00.000Z",
		};

		return { ...defaults, ...offreDeStage };
	}
}
