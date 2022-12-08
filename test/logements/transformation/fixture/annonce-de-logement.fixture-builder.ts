import { UnJeune1solution } from "@logements/transformation/domain/1jeune1solution";

export class AnnonceDeLogementFixtureBuilder {
	public static build(
		annonceDeLogement?: Partial<UnJeune1solution.AnnonceDeLogement>,
		bilanEnergetique?: Partial<UnJeune1solution.BilanEnergetique>,
		servicesInclus?: Array<UnJeune1solution.ServiceInclus>,
		servicesOptionnels?: Array<UnJeune1solution.ServiceOptionnel>,
	): UnJeune1solution.AnnonceDeLogement {
		const defaults: UnJeune1solution.AnnonceDeLogement = {
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
				: [{ nom: UnJeune1solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE }],
			servicesOptionnels: servicesOptionnels
				? servicesOptionnels
				: [{ nom: UnJeune1solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		};

		return { ...defaults, ...annonceDeLogement };
	}
}
