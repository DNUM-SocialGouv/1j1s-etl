import { UnJeune1solution } from "@logements/chargement/domain/1jeune1solution";

export interface AnnonceDeLogementRepository {
	charger(annoncesDeLogement: Array<UnJeune1solution.AnnonceDeLogement>): void;
	recuperer(): Array<UnJeune1solution.AnnonceDeLogement>;
	recupererAnnoncesDeLogementReferencees(): Array<UnJeune1solution.AnnonceDeLogement>;
}

export class AnnonceDeLogementRepositoryImpl implements AnnonceDeLogementRepository {
	public charger(annoncesDeLogement: Array<UnJeune1solution.AnnonceDeLogement>): void {
		return;
	}

	public recuperer(): Array<UnJeune1solution.AnnonceDeLogement> {
		return [{
			identifiantSource: "identifiant-source",
			titre: "Le titre de l'annonce",
			description: "La description de l'annonce",
			charge: 80,
			devise: "€",
			garantie: 2500,
			prix: 950,
			prixHT: 1030,
			surface: 28,
			surfaceMax: 0,
			meuble: true,
			etage: 1,
			type: UnJeune1solution.Type.RESIDENCE,
			typeBien: UnJeune1solution.TypeBien.T1,
			nombreDePieces: 1,
			url: "https://some.url",
			dateDeDisponibilite: "2023-01-01T00:00:00.000Z",
			imagesUrl: [{ value: "https://some.picture.url" }, { value: "https://some.picture2.url" }],
			source: UnJeune1solution.Source.IMMOJEUNE,
			bilanEnergetique: {
				consommationEnergetique: "2.21GW",
				emissionDeGaz: "B",
			},
			sourceCreatedAt: "2022-12-01T00:00:00.000Z",
			sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
			localisation: {
				pays: "France",
				codePostal: "75001",
				ville: "Paris",
				latitude: 2.135,
				longitude: 0.00,
			},
			servicesInclus: [{ nom: UnJeune1solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE }],
			servicesOptionnels: [{ nom: UnJeune1solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		}];
	}

	recupererAnnoncesDeLogementReferencees(): Array<UnJeune1solution.AnnonceDeLogement> {
		return [];
	}
}
