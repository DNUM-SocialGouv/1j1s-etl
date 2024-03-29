import { Immojeune } from "@logements/src/transformation/domain/model/immojeune";

export class AnnonceDeLogementImmojeuneFixtureBuilder {
	public static build(
		annonceDeLogement?: Partial<Immojeune.AnnonceDeLogement>,
	): Immojeune.AnnonceDeLogement {
		const defaults: Immojeune.AnnonceDeLogement = {
			externalId: "identifiant-source",
			title: "Le titre de l'annonce",
			description: "La description de l'annonce",
			url: "https://some.url",
			type: Immojeune.TypeDeLogement.LOCATION,
			property_type: Immojeune.TypeDeBien.APPARTEMENT,
			country: "France",
			address: "1 rue de rivoli",
			city: "Paris",
			zipCode: "75001",
			availableAt: "2023-01-01T00:00:00.000Z",
			floor: 1,
			surface: 28,
			nbRooms: 1,
			furnished: true,
			agenceeFees: 650,
			charges: 80,
			currency: "EUR",
			deposit: 2500,
			rent: 950,
			totalPricing: 1030,
			date_creation: "2022-12-01T00:00:00.000Z",
			date_update: "2022-12-01T00:00:00.000Z",
			energyConsumption: "2.21GW",
			greenhouseGasesEmission: "B",
			latitude: 2.135,
			longitude: 0.00,
			includedServices: [Immojeune.ServiceInclus.TV],
			optionalServices: [Immojeune.ServiceOptionnel.DEFAULT],
			pictures: ["https://some.picture.url", "https://some.picture2.url"],
		};

		return { ...defaults, ...annonceDeLogement };
	}
}
