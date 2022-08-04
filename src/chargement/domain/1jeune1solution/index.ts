export namespace UnJeune1Solution {
	export type OffreDeStage = {
		titre: string
		dateDeDebut: string
		description: string
		urlDeCandidature?: string
		sourceCreatedAt: string
		sourceUpdatedAt: string
		sourcePublishedAt: string
		identifiantSource?: string
		domaines?: Array<string>
		dureeEnJour?: number
		dureeEnJourMax?: number
		localisation?: Localisation
		employeur?: Employeur
		remunerationBase?: number
		source: string
		teletravailPossible?: boolean
	}

	export interface OffreDeStageRepository {
		charger(offresDeStages: Array<OffreDeStage>): Promise<void>;
		recuperer(nomDuFlux: string): Promise<Array<OffreDeStage>>;
	}

	type Employeur = {
		nom: string
		description?: string
		logoUrl: string
		siteUrl: string
	}

	type Localisation = {
		ville?: string
		departement?: string
		codePostal?: string
		region?: string
		pays: string
		_geo?: {
			lat: number
			lng: number
		}
	}
}
