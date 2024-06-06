import { Studapart } from "@logements/src/transformation/domain/model/studapart";
import BooleanStudapart = Studapart.BooleanStudapart;

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
			furnished: BooleanStudapart.TRUE,
			address: "1 rue de rivoli",
			city: "Paris",
			country: "France",
			zipcode: "75001",
			latitude: "2.135",
			longitude: "0.00",
			pictures: ["https://some.picture.url", "https://some.picture2.url"],
			rooms_count: "1",
			options: {
				tv: BooleanStudapart.TRUE,
				basement: BooleanStudapart.FALSE,
				dish_washer: BooleanStudapart.FALSE,
				oven: BooleanStudapart.FALSE,
				dryer: BooleanStudapart.FALSE,
				elevator: BooleanStudapart.FALSE,
				garage: BooleanStudapart.FALSE,
				terrace: BooleanStudapart.FALSE,
				optic_fiber: BooleanStudapart.FALSE,
				guardian: BooleanStudapart.FALSE,
				micro_wave: BooleanStudapart.FALSE,
				refrigerator: BooleanStudapart.FALSE,
				washing_machine: BooleanStudapart.FALSE,
				fitness_room: BooleanStudapart.FALSE,
				swimming_pool: BooleanStudapart.FALSE,
			},
		};

		return { ...defaults, ...annonceDeLogement };
	}
}
