import { Studapart } from "@logements/transformation/domain/model/studapart";
import { StudapartBoolean } from "@logements/transformation/domain/model/studapart/studapart-boolean.value-object";

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
		const falseValueFromStudapart = new StudapartBoolean("0");
		const defaults: Studapart.AnnonceDeLogement = {
			id: "identifiant-source",
			url_redirection: "https://some.url",
			title: "Le titre de l'annonce",
			description: "La description de l'annonce",
			announcement_type: "rental",
			property_type: "apartment",
			surface: "28",
			min_rent_with_charges: "1030",
			charges: "80",
			rooms: [{ deposit: "2500" }],
			floor_number: "1",
			availability_date: "01/01/2023",
			energy_consumption: "2.21GW",
			greenhouse_gases_emission: "B",
			furnished: new StudapartBoolean("1"),
			address: "1 rue de rivoli",
			city: "Paris",
			country: "France",
			zipcode: "75001",
			latitude: "2.135",
			longitude: "0.00",
			pictures: ["https://some.picture.url", "https://some.picture2.url"],
			rooms_count: "1",
			options: {
				tv: new StudapartBoolean("1"),
				basement: falseValueFromStudapart,
				dish_washer: falseValueFromStudapart,
				oven: falseValueFromStudapart,
				dryer: falseValueFromStudapart,
				elevator: falseValueFromStudapart,
				garage: falseValueFromStudapart,
				terrace: falseValueFromStudapart,
				optic_fiber: falseValueFromStudapart,
				guardian: falseValueFromStudapart,
				micro_wave: falseValueFromStudapart,
				refrigerator: falseValueFromStudapart,
				washing_machine: falseValueFromStudapart,
				fitness_room: falseValueFromStudapart,
				swimming_pool: falseValueFromStudapart,
			},
		};

		return { ...defaults, ...annonceDeLogement };
	}
}
