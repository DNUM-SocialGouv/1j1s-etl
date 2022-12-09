import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";

export interface AnnonceDeLogementRepository {
	publier(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>): void;
	mettreAJour(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>): void;
	recupererAnnoncesDeLogementNonReferencees(): Array<UnJeune1Solution.AnnonceDeLogement>;
	recupererAnnoncesDeLogementReferencees(): Array<UnJeune1Solution.AnnonceDeLogement>;
	supprimer(annoncesDeLogements: Array<UnJeune1Solution.AnnonceDeLogement>): void;
}

export class AnnonceDeLogementRepositoryImpl implements AnnonceDeLogementRepository {
	public publier(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>): void {
	}

	public mettreAJour(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>): void {
	}

	public recupererAnnoncesDeLogementNonReferencees(): Array<UnJeune1Solution.AnnonceDeLogement> {
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
			type: UnJeune1Solution.Type.RESIDENCE,
			typeBien: UnJeune1Solution.TypeBien.T1,
			nombreDePieces: 1,
			url: "https://some.url",
			dateDeDisponibilite: "2023-01-01T00:00:00.000Z",
			imagesUrl: [{ value: "https://some.picture.url" }, { value: "https://some.picture2.url" }],
			source: UnJeune1Solution.Source.IMMOJEUNE,
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
			servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE }],
			servicesOptionnels: [{ nom: UnJeune1Solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		}];
	}

	public recupererAnnoncesDeLogementReferencees(): Array<UnJeune1Solution.AnnonceDeLogement> {
		return [];
	}

	public supprimer(annoncesDeLogements: Array<UnJeune1Solution.AnnonceDeLogement>): void {
	}
}
