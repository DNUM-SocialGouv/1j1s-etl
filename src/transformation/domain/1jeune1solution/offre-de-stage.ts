import { Jobteaser } from "@transformation/domain/offre-de-stage/offre-de-stage.jobteaser";
import { DateService } from "@shared/date.service";

export enum Domaine {
	ACHAT = "achats",
	CULTURE = "activités sociales et culturelles",
	ADMINISTRATION = "administration",
	ARCHITECTURE = "architecture / urbanisme",
	AUDIT = "audit",
	CHIMIE = "chimie / biologie / agronomie",
	COMMUNICATION = "communication",
	COMMUNITY_MANAGEMENT = "community management",
	COMPTABILITE = "comptabilité / contrôle de gestion",
	GENIE_CIVIL = "conception / génie civil / génie industriel",
	CONSEIL = "conseil",
	DESIGN = "design / UX / UI",
	INFORMATIQUE = "développement informatique",
	DIRECTION = "direction d'entreprise",
	ENERGIE = "énergie / matériaux / mécanique",
	ENSEIGNEMENT = "enseignement",
	ENVIRONNEMENT = "environnement",
	DATA = "études / statistiques / data",
	EVENEMENTIEL = "evénementiel",
	FISCALITE = "fiscalite",
	GESTION_PROJET = "gestion de projet / produit",
	GRAPHISME = "graphisme / illustration",
	HOTELLERIE = "hôtellerie - restauration",
	TELECOM = "infra / réseaux / télécoms",
	JOURNALISME = "journalisme / rp",
	JURIDIQUE = "juridique",
	LOGISTIQUE = "logistique",
	MARKETING = "marketing",
	EXPLOITATION = "production / fabrication / exploitation",
	AUDIOVISUELLE = "production audiovisuelle",
	MAINTENANCE = "qualité / maintenance",
	SUPPORT = "relation client / support",
	RH = "rh / formation",
	SANTE = "santé",
	SERVICE_A_LA_PERSONNE = "services à la personne",
	TRAVAUX = "travaux / chantiers",
	NON_APPLICABLE = "n/a"
}

type Employeur = {
	nom: string
	description: string
	logoUrl: string
	siteUrl: string
}

type Localisation = {
	ville?: string
	departement?: string
	codePostal?: string
	region?: string // enum de region ? (interessant pour savoir si pays en full + majuscule …)
	pays: string // enum de pays ? (interessant pour savoir si pays en full + majuscule …) (https://www.npmjs.com/package/i18n-iso-countries ?)
	_geo?: {
		lat: number
		lng: number
	}
}

export enum Source {
	INTERNE = "interne",
	WELCOME_TO_THE_JUNGLE = "welcome to the jungle",
	JOBIJOBA = "jobijoba",
	HELLOWORK = "hellowork",
	JOBTEASER = "jobteaser"
}

export type OffreDeStage = {
	titre: string
	// id: string
	// slug: string
	// createdAt: string
	// publishedAt: string
	// updatedAt: string
	dateDeDebut: string
	description: string
	urlDeCandidature?: string
	sourceCreatedAt: string
	sourceUpdatedAt: string
	sourcePublishedAt: string
	identifiantSource?: string
	domaines?: Array<Domaine>
	duree?: string
	dureeEnJour?: number
	dureeEnJourMax?: number
	localisation?: Localisation
	employeur?: Employeur
	remunerationBase?: number
	source: Source
	teletravailPossible?: boolean
}

export class ConvertirOffreDeStage {
	constructor(private readonly dateService: DateService) {
	}

	depuisJobteaser(offreDeStageJobteaser: Jobteaser.OffreDeStage): OffreDeStage {
		return {
			titre: offreDeStageJobteaser.title,
			description: offreDeStageJobteaser.mission,
			employeur: {
				description: offreDeStageJobteaser.company.description,
				nom: offreDeStageJobteaser.company.name,
				logoUrl: offreDeStageJobteaser.company.logo,
				siteUrl: offreDeStageJobteaser.company.website,
			},
			localisation: {
				ville: offreDeStageJobteaser.location.city,
				codePostal: offreDeStageJobteaser.location.zipcode,
				departement: offreDeStageJobteaser.location.department,
				region: offreDeStageJobteaser.location.state,
				pays: offreDeStageJobteaser.location.country,
			},
			source: Source.JOBTEASER,
			urlDeCandidature: offreDeStageJobteaser.external_url,
			teletravailPossible: false,
			dateDeDebut: offreDeStageJobteaser.start_date,
			sourceCreatedAt: offreDeStageJobteaser.date_created,
			sourcePublishedAt: this.dateService.maintenant().toISOString(),
			sourceUpdatedAt: this.dateService.maintenant().toISOString(),
			remunerationBase: -1,
			identifiantSource: offreDeStageJobteaser.reference,
			duree: offreDeStageJobteaser.contract.duration.amount,
			dureeEnJour: Number(offreDeStageJobteaser.contract.duration.amount),
			dureeEnJourMax: undefined,
			domaines: Array.isArray(offreDeStageJobteaser.domains.domain)
				? offreDeStageJobteaser.domains.domain.map((d) => Domaine[d as keyof typeof Domaine] || Domaine.NON_APPLICABLE)
				: [Domaine[offreDeStageJobteaser.domains.domain as keyof typeof Domaine] || Domaine.NON_APPLICABLE],
		};
	}
}
