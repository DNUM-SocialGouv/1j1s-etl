import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { UnJeune1Solution } from "@logements/transformation/domain/1jeune1solution";
import { StudapartBoolean } from "@logements/transformation/domain/studapart/studapart-boolean";
import { Devise } from "@shared/devise";

export namespace Studapart {

    export type Contenu = {
        unjeuneunesolution: { item: Array<AnnonceDeLogement> }
    }

    export type AnnonceDeLogement = {
        id: string
        url_redirection: string
        title: string
        description: string
        announcement_type: TypeDAnnonce
        property_type: TypeDeBien
        surface: string
        min_rent_with_charges: string
        charges: string
        rooms?: Array<Room>
        floor_number?: string
        availability_date: string
        energy_consumption: string
        greenhouse_gases_emission: string
        furnished: StudapartBoolean
        address: string
        city: string
        country: string
        zipcode: string
        latitude: string
        longitude: string
        pictures: Array<string>
        rooms_count: string
        options?: OptionsLogement
    }

    export type TypeDeBien = "apartment" | "house"
    export type TypeDAnnonce = "rental" | "service" | "homestay"

    export type Room = {
        deposit: string
    }

    export type OptionsLogement = {
        tv?: StudapartBoolean
        basement?: StudapartBoolean
        dish_washer?: StudapartBoolean
        oven?: StudapartBoolean
        dryer?: StudapartBoolean
        elevator?: StudapartBoolean
        garage?: StudapartBoolean
        terrace?: StudapartBoolean
        optic_fiber?: StudapartBoolean
        guardian?: StudapartBoolean
        micro_wave?: StudapartBoolean
        refrigerator?: StudapartBoolean
        washing_machine?: StudapartBoolean
        fitness_room?: StudapartBoolean
        swimming_pool?: StudapartBoolean
    }

    const optionsLogementTraduitEnUnJeuneUneSolution: {[key: string]: UnJeune1Solution.ServiceInclus.Nom} = {
        tv: UnJeune1Solution.ServiceInclus.Nom.TV,
        basement: UnJeune1Solution.ServiceInclus.Nom.CAVE,
        dish_washer: UnJeune1Solution.ServiceInclus.Nom.LAVE_VAISSELLE,
        oven: UnJeune1Solution.ServiceInclus.Nom.FOUR,
        dryer: UnJeune1Solution.ServiceInclus.Nom.SECHE_LINGE,
        elevator: UnJeune1Solution.ServiceInclus.Nom.ASCENSEUR,
        garage: UnJeune1Solution.ServiceInclus.Nom.GARAGE,
        terrace: UnJeune1Solution.ServiceInclus.Nom.TERRACE,
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
                    codePostal: studapartLogement.zipcode,
                    pays: studapartLogement.country,
                    latitude: Number(studapartLogement.latitude),
                    longitude: Number(studapartLogement.longitude),
                },
                sourceCreatedAt: this.dateService.stringifyMaintenant(),
                sourceUpdatedAt: this.dateService.stringifyMaintenant(),
                imagesUrl: studapartLogement.pictures.map(picture => ({ value: picture })),
                servicesInclus: this.depuisOptionLogements(studapartLogement.options),
                servicesOptionnels: [],
                prixHT: -1,
                prix: Number(studapartLogement.min_rent_with_charges),
                devise: new Devise("EUR"),
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

        private depuisTypeDeBien(typeDeBien: TypeDeBien): UnJeune1Solution.TypeBien {
            switch (typeDeBien) {
                case "apartment": return UnJeune1Solution.TypeBien.APPARTEMENT;
                case "house": return UnJeune1Solution.TypeBien.MAISON;
                default: return UnJeune1Solution.TypeBien.NON_RENSEIGNE;
            }
        }

        private depuisTypeDAnnonce(typeDannonce: TypeDAnnonce): UnJeune1Solution.Type {
            switch (typeDannonce) {
                case "service": return UnJeune1Solution.Type.LOGEMENT_CONTRE_SERVICES;
                case "homestay": return UnJeune1Solution.Type.LOGEMENT_CHEZ_L_HABITANT;
                case "rental": return UnJeune1Solution.Type.LOCATION;
                default: return UnJeune1Solution.Type.NON_RENSEIGNE;
            }
        }

        private depuisGarantie(rooms?: Array<Room>): number {
            if(!rooms) {
                return 0;
            }
            if(rooms.length > 1) {
                return this.extraireValeurMinimumDeLaGarantieDesChambres(rooms);
            } else {
                return Number(rooms[0].deposit);
            }
        }

        private extraireValeurMinimumDeLaGarantieDesChambres(rooms: Array<Room>): number {
            return Math.min(...rooms.map(room => Number(room.deposit)));
        }

        private depuisOptionLogements(optionsLogement?: OptionsLogement): Array<UnJeune1Solution.ServiceInclus> {
            if(optionsLogement) {
                return Object
                    .entries(optionsLogement)
                    .filter(([key, studapartBoolean]) => key !== undefined && studapartBoolean.value)
                    .map(([key]) => ({ nom: optionsLogementTraduitEnUnJeuneUneSolution[key] }));
            } else return [];
        }
    }
}
