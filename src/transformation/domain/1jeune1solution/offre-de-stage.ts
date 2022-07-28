import { UnJeune1Solution } from "@transformation/domain/1jeune1solution/index";
import Domaine = UnJeune1Solution.Domaine;

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
