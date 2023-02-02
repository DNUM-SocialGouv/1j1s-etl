export type BilanEnergetique = {
	consommationEnergetique?: string
	emissionDeGaz?: string
}

export type ImagesUrl = {
	value: string
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

export namespace ServiceInclus {
	export enum Nom {
		ASCENSEUR = "ascenseur",
		ASPIRATEUR = "aspirateur",
		CAVE = "cave",
		FER_A_REPASSER = "fer à repasser",
		FIBRE_OPTIQUE = "fibre optique",
		FOUR = "four",
		GARAGE = "garage",
		GARDIEN_RESIDENCE = "gardien résidentiel",
		INTERNET = "internet",
		LAVE_LINGE = "machine à laver",
		LAVE_VAISSELLE = "lave vaisselle",
		LOCAL_A_VELO = "local à vélo",
		MICRO_ONDE = "micro-onde",
		NECESSAIRE_DE_NETTOYAGE = "nécessaire de nettoyage",
		PARKING = "parking",
		PISCINE = "piscine",
		REFRIGERATEUR = "réfrigérateur",
		SALLE_DE_BAIN_PRIVATIVE = "salle de bain privative",
		SALLE_DE_SPORT = "salle de sport",
		SECHE_LINGE = "sèche linge",
		TERRACE = "terrace",
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

export enum Source {
	IMMOJEUNE = "immojeune",
	STUDAPART = "studapart",
}

export enum TypeAnnonce {
	COLOCATION = "colocation",
	COURTE = "courte",
	INTERGENERATIONNEL = "habitation intergénérationnelle",
	LOCATION = "location",
	RESIDENCE = "résidence",
	SOUS_LOCATION = "sous-location",
	NON_RENSEIGNE = "non renseigné"
}

export enum TypeBien {
	APPARTEMENT = "appartement",
	CHAMBRE = "chambre",
	COLOCATION = "colocation",
	IMMEUBLE = "immeuble",
	MAISON = "maison",
	STUDIO = "studio",
	T1 = "t1",
	T1BIS = "t1bis",
	T2 = "t2",
	T3 = "t3",
	T4 = "t4",
	PLUS_GRAND = "t4 et plus",
	NON_RENSEIGNE = "non renseigné",
}
