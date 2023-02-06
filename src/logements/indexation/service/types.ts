export namespace AnnonceDeLogement {
	export interface AIndexer {
		id: string;
		slug: string;
		titre: string;
		dateDeDisponibilite: string;
		dateDeMiseAJour: string;
		devise: string;
		prix: number;
		prixHT: number;
		surface: number;
		surfaceMax: number;
		surfaceAAfficher: string;
		type: string;
		url: string;
		imagesUrl: Array<string>;
		sourceUpdatedAt: string;
		localisationAAfficher: string;
	}

	export interface Brute {
		id: string;
		slug: string;
		titre: string;
		dateDeDisponibilite: string;
		devise: string;
		prix: number;
		prixHT: number;
		surface: number;
		surfaceMax: number;
		type: string;
		url: string;
		imagesUrl: Array<{ value: string }>;
		sourceUpdatedAt: string;
		localisation: Localisation;
	}

	export interface Localisation {
		latitude: number;
		longitude: number;
		ville: string;
		adresse: string;
		departement: string;
		codePostal: string;
		region: string;
		pays: string;
	}
}
