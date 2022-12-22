import { UnJeune1Solution } from "@logements/chargement/domain/1jeune1solution";

export class AnnonceDeLogementFixtureBuilder {
	public static build(
		annonceDeLogement?: Partial<UnJeune1Solution.AttributsAnnonceDeLogement>,
		bilanEnergetique?: Partial<UnJeune1Solution.BilanEnergetique>,
		servicesInclus?: Array<UnJeune1Solution.ServiceInclus>,
		servicesOptionnels?: Array<UnJeune1Solution.ServiceOptionnel>,
	): UnJeune1Solution.AnnonceDeLogement {
		const defaults: UnJeune1Solution.AttributsAnnonceDeLogement = {
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
			type: UnJeune1Solution.TypeAnnonce.RESIDENCE,
			typeBien: UnJeune1Solution.TypeBien.T1,
			nombreDePieces: 1,
			url: "https://some.url",
			dateDeDisponibilite: "2023-01-01T00:00:00.000Z",
			imagesUrl: [{ value: "https://some.picture.url" }, { value: "https://some.picture2.url" }],
			source: UnJeune1Solution.Source.IMMOJEUNE,
			bilanEnergetique: {
				consommationEnergetique: "2.21GW",
				emissionDeGaz: "B",
				...bilanEnergetique,
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
			servicesInclus: servicesInclus
				? servicesInclus
				: [{ nom: UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE }],
			servicesOptionnels: servicesOptionnels
				? servicesOptionnels
				: [{ nom: UnJeune1Solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		};

		return new UnJeune1Solution.AnnonceDeLogement({ ...defaults, ...annonceDeLogement });
	}

	public static buildAnnonceASupprimer(
		annonceDeLogement?: Partial<UnJeune1Solution.AnnonceDeLogementObsolete>,
		identifiant?: string
	): UnJeune1Solution.AnnonceDeLogementObsolete {
		const defaults = {
			identifiantSource: "identifiant-source",
			sourceUpdatedAt: "2022-12-01T00:00:00.000Z",
		};

		return new UnJeune1Solution.AnnonceDeLogementObsolete({ ...defaults, ...annonceDeLogement }, identifiant || "0");
	}

	public static buildNouvelleAnnonce(
		annonceDeLogement?: Partial<UnJeune1Solution.NouvelleAnnonceDeLogement>,
		bilanEnergetique?: Partial<UnJeune1Solution.BilanEnergetique>,
		servicesInclus?: Array<UnJeune1Solution.ServiceInclus>,
		servicesOptionnels?: Array<UnJeune1Solution.ServiceOptionnel>,
	): UnJeune1Solution.NouvelleAnnonceDeLogement {
		const defaults = {
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
			type: UnJeune1Solution.TypeAnnonce.RESIDENCE,
			typeBien: UnJeune1Solution.TypeBien.T1,
			nombreDePieces: 1,
			url: "https://some.url",
			dateDeDisponibilite: "2023-01-01T00:00:00.000Z",
			imagesUrl: [{ value: "https://some.picture.url" }, { value: "https://some.picture2.url" }],
			source: UnJeune1Solution.Source.IMMOJEUNE,
			bilanEnergetique: {
				consommationEnergetique: "2.21GW",
				emissionDeGaz: "B",
				...bilanEnergetique,
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
			servicesInclus: servicesInclus
				? servicesInclus
				: [{ nom: UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE }],
			servicesOptionnels: servicesOptionnels
				? servicesOptionnels
				: [{ nom: UnJeune1Solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		};

		return new UnJeune1Solution.NouvelleAnnonceDeLogement({ ...defaults, ...annonceDeLogement });
	}

	public static buildAnnonceAMettreAJour(
		annonceDeLogement?: Partial<UnJeune1Solution.AnnonceDeLogementAMettreAJour>,
		identifiant?: string,
		bilanEnergetique?: Partial<UnJeune1Solution.BilanEnergetique>,
		servicesInclus?: Array<UnJeune1Solution.ServiceInclus>,
		servicesOptionnels?: Array<UnJeune1Solution.ServiceOptionnel>,
	): UnJeune1Solution.AnnonceDeLogementAMettreAJour {
		const defaults = {
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
			type: UnJeune1Solution.TypeAnnonce.RESIDENCE,
			typeBien: UnJeune1Solution.TypeBien.T1,
			nombreDePieces: 1,
			url: "https://some.url",
			dateDeDisponibilite: "2023-01-01T00:00:00.000Z",
			imagesUrl: [{ value: "https://some.picture.url" }, { value: "https://some.picture2.url" }],
			source: UnJeune1Solution.Source.IMMOJEUNE,
			bilanEnergetique: {
				consommationEnergetique: "2.21GW",
				emissionDeGaz: "B",
				...bilanEnergetique,
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
			servicesInclus: servicesInclus
				? servicesInclus
				: [{ nom: UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE }],
			servicesOptionnels: servicesOptionnels
				? servicesOptionnels
				: [{ nom: UnJeune1Solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		};

		return new UnJeune1Solution.AnnonceDeLogementAMettreAJour({ ...defaults, ...annonceDeLogement }, identifiant || "0");
	}

	public static buildAnnonceEnErreur(annonceEnErreur?: Partial<UnJeune1Solution.AnnonceDeLogementEnErreur>): UnJeune1Solution.AnnonceDeLogementEnErreur {
		const defaults: UnJeune1Solution.AnnonceDeLogementEnErreur = {
			motif: "Oops something went wrong!",
			annonce: this.build(),
		};

		return { ...defaults, ...annonceEnErreur };
	}

	public static buildAnnonceReferencee(annonceReferencee?: Partial<UnJeune1Solution.AnnonceDeLogementReferencee>): UnJeune1Solution.AnnonceDeLogementReferencee {
		const defaults: UnJeune1Solution.AnnonceDeLogementReferencee = {
			identifiantSource: AnnonceDeLogementFixtureBuilder.build().identifiantSource,
			sourceUpdatedAt: AnnonceDeLogementFixtureBuilder.build().sourceUpdatedAt,
			id: "0",
		};

		return { ...defaults, ...annonceReferencee };
	}
}
