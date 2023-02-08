import { AnnonceDeLogement } from "@logements/indexation/domain/model";

export class AnnonceDeLogementFixtureBuilder {
	public static buildAnnonceDeLogementBrute(override?: Partial<AnnonceDeLogement.Attributs>): AnnonceDeLogement.Brute {
		const defaults: AnnonceDeLogement.Attributs = {
			id: "1",
			slug: "appartement-t2-1",
			titre: "Appartement T2",
			dateDeDisponibilite: "2023-12-12T03:04:05.000Z",
			devise: "euros",
			prix: 750,
			prixHT: 700,
			surface: 44,
			surfaceMax: 50,
			type: "colocation",
			url: "http://some.url",
			imagesUrl: [
				{ value: "http://some.url/1" },
				{ value: "http://some.url/2" },
			],
			sourceUpdatedAt: "2023-06-12T03:04:05.000Z",
			localisation: {
				adresse: "35 Avenue de l'Opéra",
				codePostal: "75001",
				ville: "Paris",
				departement: "Île-de-France",
				region: "Île-de-France",
				pays: "France",
				latitude: 0,
				longitude: 0,
			},
		};

		return new AnnonceDeLogement.Brute({ ...defaults, ...override });
	}

	public static buildAnnonceDeLogementAIndexer(override?: Partial<AnnonceDeLogement.AIndexer>): AnnonceDeLogement.AIndexer {
		const defaults: AnnonceDeLogement.AIndexer = {
			id: "1",
			slug: "appartement-t2-1",
			titre: "Appartement T2",
			dateDeDisponibilite: "2023-12-12T03:04:05.000Z",
			dateDeMiseAJour: "2023-06-12",
			devise: "€",
			prix: 750,
			prixHT: 700,
			surface: 44,
			surfaceMax: 50,
			surfaceAAfficher: "de 44 à 50 m²",
			type: "colocation",
			url: "http://some.url",
			imagesUrl: [
				"http://some.url/1",
				"http://some.url/2",
			],
			sourceUpdatedAt: "2023-06-12T03:04:05.000Z",
			localisationAAfficher: "75001 - Paris",
		};

		return { ...defaults, ...override };
	}
}
