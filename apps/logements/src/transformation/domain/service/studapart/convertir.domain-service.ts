import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { Studapart } from "@logements/src/transformation/domain/model/studapart";

import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { DateService } from "@shared/src/date.service";
import { Devise } from "@shared/src/devise.value-object";

const optionsLogementTraduitEnUnJeuneUneSolution: Record<string, UnJeune1Solution.ServiceInclus.Nom> = {
	tv: UnJeune1Solution.ServiceInclus.Nom.TV,
	basement: UnJeune1Solution.ServiceInclus.Nom.CAVE,
	dish_washer: UnJeune1Solution.ServiceInclus.Nom.LAVE_VAISSELLE,
	oven: UnJeune1Solution.ServiceInclus.Nom.FOUR,
	dryer: UnJeune1Solution.ServiceInclus.Nom.SECHE_LINGE,
	elevator: UnJeune1Solution.ServiceInclus.Nom.ASCENSEUR,
	garage: UnJeune1Solution.ServiceInclus.Nom.GARAGE,
	terrace: UnJeune1Solution.ServiceInclus.Nom.TERRASSE,
	optic_fiber: UnJeune1Solution.ServiceInclus.Nom.FIBRE_OPTIQUE,
	guardian: UnJeune1Solution.ServiceInclus.Nom.GARDIEN_RESIDENCE,
	micro_wave: UnJeune1Solution.ServiceInclus.Nom.MICRO_ONDE,
	refrigerator: UnJeune1Solution.ServiceInclus.Nom.REFRIGERATEUR,
	washing_machine: UnJeune1Solution.ServiceInclus.Nom.LAVE_LINGE,
	fitness_room: UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_SPORT,
	swimming_pool: UnJeune1Solution.ServiceInclus.Nom.PISCINE,
};

export class Convertir {
	constructor(
		private readonly assainisseurDeTexte: AssainisseurDeTexte,
		private readonly dateService: DateService,
	) {}

	depuisStudapartVersUnJeuneUneSolution(studapartLogement: Studapart.AnnonceDeLogement): UnJeune1Solution.AnnonceDeLogement {
		return {
			identifiantSource: studapartLogement.id,
			titre: studapartLogement.title,
			description: this.assainisseurDeTexte.nettoyer(studapartLogement.description),
			url: studapartLogement.url_redirection,
			source: UnJeune1Solution.Source.STUDAPART,
			typeBien: this.depuisTypeDeBien(studapartLogement.property_type),
			type: this.depuisTypeDAnnonce(studapartLogement.announcement_type),
			surface: Number(studapartLogement.surface),
			surfaceMax: undefined,
			nombreDePieces: Number(studapartLogement.rooms_count),
			etage: this.depuisEtage(studapartLogement),
			dateDeDisponibilite: this.dateService.toIsoDateAvecDate(studapartLogement.availability_date),
			bilanEnergetique: {
				consommationEnergetique: studapartLogement.energy_consumption,
				emissionDeGaz: studapartLogement.greenhouse_gases_emission,
			},
			meuble: this.estMeuble(studapartLogement),
			localisation: {
				adresse: studapartLogement.address,
				ville: studapartLogement.city,
				codePostal: studapartLogement.zipcode.toString(),
				pays: studapartLogement.country,
				latitude: Number(studapartLogement.latitude),
				longitude: Number(studapartLogement.longitude),
			},
			sourceCreatedAt: this.dateService.stringifyMaintenant(),
			sourceUpdatedAt: this.dateService.stringifyMaintenant(),
			imagesUrl: studapartLogement.pictures.map(picture => ({ value: picture })),
			servicesInclus: this.depuisOptionLogements(studapartLogement.options),
			servicesOptionnels: [],
			prixHT: 0,
			prix: Number(studapartLogement.min_rent_with_charges),
			devise: new Devise("EUR").value,
			charge: Number(studapartLogement.charges),
			garantie: this.depuisGarantie(studapartLogement.rooms),
		};
	}

	private estMeuble(studapartLogement: Studapart.AnnonceDeLogement): boolean {
		return studapartLogement.furnished.value;
	}

	private depuisEtage(studapartLogement: Studapart.AnnonceDeLogement): number {
		return studapartLogement.floor_number ? Number(studapartLogement.floor_number) : 0;
	}

	private depuisTypeDeBien(typeDeBien: Studapart.TypeDeBien): UnJeune1Solution.TypeBien {
		switch (typeDeBien) {
			case "apartment": return UnJeune1Solution.TypeBien.APPARTEMENT;
			case "house": return UnJeune1Solution.TypeBien.MAISON;
			default: return UnJeune1Solution.TypeBien.NON_RENSEIGNE;
		}
	}

	private depuisTypeDAnnonce(typeDannonce: Studapart.TypeDAnnonce): UnJeune1Solution.Type {
		switch (typeDannonce) {
			case "service": return UnJeune1Solution.Type.LOGEMENT_CONTRE_SERVICES;
			case "homestay": return UnJeune1Solution.Type.LOGEMENT_CHEZ_L_HABITANT;
			case "rental": return UnJeune1Solution.Type.LOCATION;
			default: return UnJeune1Solution.Type.NON_RENSEIGNE;
		}
	}

	private depuisGarantie(rooms?: Array<Studapart.Room>): number {
		if(!rooms) {
			return 0;
		}
		if(rooms.length > 1) {
			return this.extraireValeurMinimumDeLaGarantieDesChambres(rooms);
		} else {
			return Number(rooms[0].deposit);
		}
	}

	private extraireValeurMinimumDeLaGarantieDesChambres(rooms: Array<Studapart.Room>): number {
		return Math.min(...rooms.map(room => Number(room.deposit)));
	}

	private depuisOptionLogements(optionsLogement?: Studapart.OptionsLogement): Array<UnJeune1Solution.ServiceInclus> {
		if(optionsLogement) {
			return Object
				.entries(optionsLogement)
				.filter(([key, studapartBoolean]) => key !== undefined && studapartBoolean.value)
				.map(([key]) => ({ nom: optionsLogementTraduitEnUnJeuneUneSolution[key] }));
		} else return [];
	}
}
