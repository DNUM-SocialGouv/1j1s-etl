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

export interface AnnonceDeLogementBrute {
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

export interface AnnonceDeLogementAIndexer {
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

export interface AnnonceDeLogementRepository {
	indexer(annoncesDeLogement: Array<AnnonceDeLogementAIndexer>): Promise<void>;
	recupererLesAnnonces(source: string): Promise<Array<AnnonceDeLogementBrute>>;
}
