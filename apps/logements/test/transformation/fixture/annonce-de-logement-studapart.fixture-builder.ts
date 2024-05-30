import { Studapart } from "@logements/src/transformation/domain/model/studapart";

export class AnnonceDeLogementStudapartContenuFixtureBuilder {
	public static build(annonceDeLogements: Array<Studapart.AnnonceDeLogement>): Studapart.Contenu {
		return {
			unjeuneunesolution: {
				item: annonceDeLogements,
			},
		};
	}
}

export class AnnonceDeLogementStudapartFixtureBuilder {
	public static build(
		annonceDeLogement?: Partial<Studapart.AnnonceDeLogement>,
	): Studapart.AnnonceDeLogement {
		const defaults: Studapart.AnnonceDeLogement = {
			id: "identifiant-source",
			url_redirection: "https://some.url",
			title: "Le titre de l'annonce",
			description: "La description de l'annonce",
			announcement_type: "rental",
			property_type: "apartment",
			surface: "28",
			min_rent_with_charges: "1030",
			full_property_rent_with_charges: "1200",
			charges: "80",
			rooms: [{ deposit: "2500" }],
			floor_number: "1",
			availability_date: "01/01/2023",
			energy_consumption: "2.21GW",
			greenhouse_gases_emission: "B",
			furnished: 1,
			address: "1 rue de rivoli",
			city: "Paris",
			country: "France",
			zipcode: "75001",
			latitude: "2.135",
			longitude: "0.00",
			pictures: ["https://some.picture.url", "https://some.picture2.url"],
			rooms_count: "1",
			options: {
				tv: 1,
				basement: 0,
				dish_washer: 0,
				oven: 0,
				dryer: 0,
				elevator: 0,
				garage: 0,
				terrace: 0,
				optic_fiber: 0,
				guardian: 0,
				micro_wave: 0,
				refrigerator: 0,
				washing_machine: 0,
				fitness_room: 0,
				swimming_pool: 0,
			},
		};

		return { ...defaults, ...annonceDeLogement };
	}
}
