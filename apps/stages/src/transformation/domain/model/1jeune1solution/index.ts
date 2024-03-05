import { Domaine as _Domaine } from "./domaine";

export namespace UnJeune1Solution {
	export import Domaine = _Domaine;

	export type OffreDeStage = {
		titre: string
		dateDeDebutMin: string
		dateDeDebutMax: string
		description: string
		urlDeCandidature?: string
		sourceCreatedAt: string
		sourceUpdatedAt: string
		sourcePublishedAt: string
		identifiantSource?: string
		domaines?: Array<{ nom: Domaine }>
		dureeEnJour?: number
		dureeEnJourMax?: number
		localisation?: Localisation
		employeur?: Employeur
		remunerationBase?: number
		remunerationMin?: number
		remunerationMax?: number
		remunerationPeriode?: RemunerationPeriode
		source: Source
		teletravailPossible?: boolean
	}

	export type Employeur = {
		nom: string
		description?: string
		logoUrl: string
		siteUrl?: string
	}

	export type Localisation = {
		ville?: string
		departement?: string
		codePostal?: string
		region?: string
		pays: string
		latitude?: number
		longitude?: number
	}

	export enum Source {
		HELLOWORK = "hellowork",
		INTERNE = "interne",
		JOBIJOBA = "jobijoba",
		JOBTEASER = "jobteaser",
		STAGEFR_COMPRESSE = "stagefr-compresse",
		STAGEFR_DECOMPRESSE = "stagefr-decompresse",
		WELCOME_TO_THE_JUNGLE = "welcome to the jungle",
	}

	export enum RemunerationPeriode {
		HOURLY = "HOURLY",
		MONTHLY = "MONTHLY",
		YEARLY = "YEARLY",
	}
}
