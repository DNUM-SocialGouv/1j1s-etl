export namespace UnJeune1solution {
	export enum Source {
		IMMOJEUNE = "immojeune",
		STUDAPART = "studapart",
	}

	export enum TypeBien {
		STUDIO = "studio",
		T1 = "T1",
		T2 = "T2",
		T3 = "T3",
		NON_RENSEIGNE = "non renseigné"
	}

	export enum Type {
		APPARTEMENT = "appartement",
		RESIDENCE = "residence",
		NON_RENSEIGNE = "non renseigné"
	}

	export type BilanEnergetique = {
		consommationEnergetique?: string
		emissionDeGaz?: string
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

	export type ImagesUrl = {
		value: string
	}

	export namespace ServiceInclus {
		export enum Nom {
			ASPIRATEUR = "aspirateur",
			FER_A_REPASSER = "fer à repasser",
			INTERNET = "internet",
			LOCAL_A_VELO = "local à vélo",
			MACHINE_A_LAVER = "machine à laver",
			MICRO_ONDE = "micro-onde",
			NECESSAIRE_DE_NETTOYAGE = "nécessaire de nettoyage",
			PARKING = "parking",
			SALLE_DE_BAIN_PRIVATIVE = "salle de bain privative",
			SALLE_DE_SPORT = "salle de sport",
			TV = "télévision",
			NON_RENSEIGNE = "non renseigné",
		}
	}

	export type ServiceInclus = {
		nom: ServiceInclus.Nom
	}

	export namespace ServiceOptionnel {
		export enum Nom {
			ASPIRATEUR = "aspirateur",
			FER_A_REPASSER = "fer à repasser",
			INTERNET = "internet",
			LOCAL_A_VELO = "local à vélo",
			MACHINE_A_LAVER = "machine à laver",
			MICRO_ONDE = "micro-onde",
			NECESSAIRE_DE_NETTOYAGE = "nécessaire de nettoyage",
			SALLE_DE_SPORT = "salle de sport",
			TV = "télévision",
			NON_RENSEIGNE = "non renseigné",
		}
	}

	export type ServiceOptionnel = {
		nom: ServiceOptionnel.Nom
	}

	export type AnnonceDeLogement = {
		identifiantSource: string
		titre: string
		description: string
		url: string
		source: UnJeune1solution.Source
		typeBien?: UnJeune1solution.TypeBien
		type: UnJeune1solution.Type
		surface: number
		surfaceMax?: number
		nombreDePieces: number
		etage: number
		dateDeDisponibilite: string
		bilanEnergetique: UnJeune1solution.BilanEnergetique
		meuble: boolean
		localisation: UnJeune1solution.Localisation
		sourceCreatedAt: string
		sourceUpdatedAt: string
		imagesUrl: Array<UnJeune1solution.ImagesUrl>
		servicesInclus: Array<UnJeune1solution.ServiceInclus>
		servicesOptionnels: Array<UnJeune1solution.ServiceOptionnel>
		prixHT: number
		prix?: number
		devise: string
		charge: number
		garantie: number
	}
}