import { Devise } from "@shared/devise";
import { UnJeune1Solution } from "@logements/transformation/domain/1jeune1solution";


export class AnnonceDeLogementFixtureBuilder {
	public static build(
		annonceDeLogement?: Partial<UnJeune1Solution.AnnonceDeLogement>,
		bilanEnergetique?: Partial<UnJeune1Solution.BilanEnergetique>,
		servicesInclus?: Array<UnJeune1Solution.ServiceInclus>,
		servicesOptionnels?: Array<UnJeune1Solution.ServiceOptionnel>,
	): UnJeune1Solution.AnnonceDeLogement {
		const defaults: UnJeune1Solution.AnnonceDeLogement = {
			identifiantSource: "identifiant-source",
			titre: "Le titre de l'annonce",
			description: "La description de l'annonce",
			charge: 80,
			devise: new Devise("EUR").value,
			garantie: 2500,
			prixHT: 950,
			prix: 1030,
			surface: 28,
			surfaceMax: 0,
			meuble: true,
			etage: 1,
			type: UnJeune1Solution.Type.LOCATION,
			typeBien: UnJeune1Solution.TypeBien.APPARTEMENT,
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
				adresse: "1 rue de rivoli",
				pays: "France",
				codePostal: "75001",
				ville: "Paris",
				latitude: 2.135,
				longitude: 0.00,
			},
			servicesInclus: servicesInclus
				? servicesInclus
				: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
			servicesOptionnels: servicesOptionnels
				? servicesOptionnels
				: [{ nom: UnJeune1Solution.ServiceOptionnel.Nom.NON_RENSEIGNE }],
		};

		return { ...defaults, ...annonceDeLogement };
	}
}
