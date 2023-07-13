import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";

export class OffreDeStageFixtureBuilder {
	static DEFAULTS_ATTRIBUTS = {
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
		dateDeDebutMax: "2022-06-01T00:00:00.000Z",
		dateDeDebutMin: "2022-06-01T00:00:00.000Z",
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

	static DEFAULT_ID = "Identifiant technique";

	static buildOffreDeStage(offreDeStage?: Partial<UnJeune1Solution.AttributsDOffreDeStage>): UnJeune1Solution.OffreDeStage {
		return new UnJeune1Solution.OffreDeStage({ ...OffreDeStageFixtureBuilder.DEFAULTS_ATTRIBUTS, ...offreDeStage });
	}

	static buildOffreDeStageAPublier(offreDeStage?: Partial<UnJeune1Solution.AttributsDOffreDeStage>): UnJeune1Solution.OffreDeStageAPublier {
		return new UnJeune1Solution.OffreDeStageAPublier({ ...OffreDeStageFixtureBuilder.DEFAULTS_ATTRIBUTS, ...offreDeStage });
	}

	static buildOffreDeStageAMettreAJour(
		offreDeStage?: Partial<UnJeune1Solution.AttributsDOffreDeStage>,
		idTechnique?: string,
	): UnJeune1Solution.OffreDeStageAMettreAJour {
		return new UnJeune1Solution.OffreDeStageAMettreAJour(
			{ ...OffreDeStageFixtureBuilder.DEFAULTS_ATTRIBUTS, ...offreDeStage },
			idTechnique || this.DEFAULT_ID,
		);
	}

	static buildOffreDeStageASupprimer(
		offreDeStage?: Partial<UnJeune1Solution.AttributsDOffreDeStage>,
		idTechnique?: string,
	): UnJeune1Solution.OffreDeStageASupprimer {
		return new UnJeune1Solution.OffreDeStageASupprimer(
			{ ...OffreDeStageFixtureBuilder.DEFAULTS_ATTRIBUTS, ...offreDeStage },
			idTechnique || this.DEFAULT_ID,
		);
	}
}
