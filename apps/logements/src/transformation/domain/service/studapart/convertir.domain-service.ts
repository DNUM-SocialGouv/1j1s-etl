import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { Studapart } from "@logements/src/transformation/domain/model/studapart";

import { Devise } from "@shared/src/domain/model/devise.value-object";
import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";
import BooleanStudapart = Studapart.BooleanStudapart;

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
	) {
	}

	depuisStudapartVersUnJeuneUneSolution(studapartLogement: Studapart.AnnonceDeLogement): UnJeune1Solution.AnnonceDeLogement {
		return {
			identifiantSource: studapartLogement.id.toString(),
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
				consommationEnergetique: this.depuisConsommationEnergetique(studapartLogement.energy_consumption),
				emissionDeGaz: this.depuisEmissionDeGazAEffetDeSerre(studapartLogement.greenhouse_gases_emission),
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
			prix: studapartLogement.min_rent_with_charges ? Number(studapartLogement.min_rent_with_charges) : Number(studapartLogement.full_property_rent_with_charges),
			devise: new Devise("EUR").value,
			charge: Number(studapartLogement.charges),
			garantie: this.depuisGarantie(studapartLogement.rooms),
		};
	}

	private depuisConsommationEnergetique(studapartConsommationEnergetique: Studapart.ConsommationEnergetique): string | undefined {
		if (studapartConsommationEnergetique === Studapart.ENERGY_CONSUMPTION_VALEUR_NON_RENSEIGNEE) {
			return undefined;
		}
		return studapartConsommationEnergetique;
	}

	private depuisEmissionDeGazAEffetDeSerre(studapartEmissionDeGazAEffetDeSerre: Studapart.EmissionDeGazAEffetDeSerre): string | undefined {
		if (studapartEmissionDeGazAEffetDeSerre === Studapart.GREENHOUSE_GASES_EMISSION_VALEUR_NON_RENSEIGNEE) {
			return undefined;
		}
		return studapartEmissionDeGazAEffetDeSerre;
	}

	private estMeuble(studapartLogement: Studapart.AnnonceDeLogement): boolean {
		return studapartLogement.furnished === BooleanStudapart.TRUE;
	}

	private depuisEtage(studapartLogement: Studapart.AnnonceDeLogement): number {
		return studapartLogement.floor_number ? Number(studapartLogement.floor_number) : 0;
	}

	private depuisTypeDeBien(typeDeBien: Studapart.TypeDeBien): UnJeune1Solution.TypeBien {
		switch (typeDeBien) {
			case "apartment":
				return UnJeune1Solution.TypeBien.APPARTEMENT;
			case "house":
				return UnJeune1Solution.TypeBien.MAISON;
			default:
				return UnJeune1Solution.TypeBien.NON_RENSEIGNE;
		}
	}

	private depuisTypeDAnnonce(typeDannonce: Studapart.TypeDAnnonce): UnJeune1Solution.Type {
		switch (typeDannonce) {
			case "service":
				return UnJeune1Solution.Type.LOGEMENT_CONTRE_SERVICES;
			case "homestay":
				return UnJeune1Solution.Type.LOGEMENT_CHEZ_L_HABITANT;
			case "rental":
				return UnJeune1Solution.Type.LOCATION;
			default:
				return UnJeune1Solution.Type.NON_RENSEIGNE;
		}
	}

	private depuisGarantie(rooms?: Array<Studapart.Room>): number {
		if (!rooms) {
			return 0;
		}
		if (rooms.length > 1) {
			return this.extraireValeurMinimumDeLaGarantieDesChambres(rooms);
		} else {
			return Number(rooms[0].deposit);
		}
	}

	private extraireValeurMinimumDeLaGarantieDesChambres(rooms: Array<Studapart.Room>): number {
		return Math.min(...rooms.map(room => Number(room.deposit)));
	}

	private depuisOptionLogements(optionsLogement?: Studapart.OptionsLogement): Array<UnJeune1Solution.ServiceInclus> {
		if (optionsLogement) {
			return Object
				.entries(optionsLogement)
				.filter(([key, optionIsIncludedValue]) => key !== undefined && optionIsIncludedValue === BooleanStudapart.TRUE)
				.map(([key]) => ({ nom: optionsLogementTraduitEnUnJeuneUneSolution[key] }));
		} else return [];
	}
}
