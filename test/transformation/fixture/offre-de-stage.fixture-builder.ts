import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export class OffreDeStageFixtureBuilder {
	static build(
		offreDeStage?: Partial<UnJeune1Solution.OffreDeStage>,
		localisation?: Partial<UnJeune1Solution.Localisation>,
		employeur?: Partial<UnJeune1Solution.Employeur>,
	): UnJeune1Solution.OffreDeStage {
		const defaultLocalisation: UnJeune1Solution.Localisation = {
			ville: "Montpellier",
			codePostal: "34",
			departement: "Hérault",
			region: "Occitanie",
			pays: "FR",
		};
		const defaultEmployeur = {
			description: "Entreprise leader de son domaine",
			nom: "Nom de l'entreprise",
			logoUrl: "http://url.du.logo",
			siteUrl: "http://site.de.l.entreprise",
		};
		const defaults: UnJeune1Solution.OffreDeStage = {
			titre: "Titre de l'offre",
			description: "Description de l'offre",
			dureeEnJour: 90,
			dureeEnJourMax: 180,
			domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
			identifiantSource: "Identifiant source",
			remunerationBase: 900,
			sourceCreatedAt: "2022-01-01T00:00:00.000Z",
			sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
			sourcePublishedAt: "2022-01-01T00:00:00.000Z",
			dateDeDebut: "2022-06-01T00:00:00.000Z",
			teletravailPossible: true,
			urlDeCandidature: "http://url.de.candidature.com",
			source: UnJeune1Solution.Source.JOBTEASER,
			employeur: { ...defaultEmployeur, ...employeur },
			localisation: { ...defaultLocalisation, ...localisation },
		};

		return { ...defaults, ...offreDeStage };
	}
}
