import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

export class OffreDeStageFixtureBuilder {
	static build(offreDeStage?: Partial<UnJeune1Solution.OffreDeStage>): UnJeune1Solution.OffreDeStage {
		const defaults: UnJeune1Solution.OffreDeStage = {
			titre: "Titre de l'offre",
			description: "Description de l'offre",
			dureeEnJour: 90,
			dureeEnJourMax: 180,
			domaines: ["non renseigné"],
			identifiantSource: "Identifiant source",
			remunerationBase: 900,
			sourceCreatedAt: "2022-01-01T00:00:00.000Z",
			sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
			sourcePublishedAt: "2022-01-01T00:00:00.000Z",
			dateDeDebut: "2022-06-01T00:00:00.000Z",
			teletravailPossible: true,
			urlDeCandidature: "http://url.de.candidature.com",
			source: "jobteaser",
			employeur: {
				description: "Entreprise leader de son domaine",
				nom: "Nom de l'entreprise",
				logoUrl: "http://url.du.logo",
				siteUrl: "http://site.de.l.entreprise",
			},
			localisation: {
				ville: "Montpellier",
				codePostal: "34",
				departement: "Hérault",
				region: "Occitanie",
				pays: "France",
			},
		};

		return { ...defaults, ...offreDeStage };
	}
}
