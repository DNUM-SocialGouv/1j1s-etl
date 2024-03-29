import { StudapartBoolean } from "@logements/src/transformation/domain/model/studapart/studapart-boolean.value-object";

export namespace Studapart {
    export type Contenu = {
        unjeuneunesolution: { item: Array<AnnonceDeLogement> }
    }

    export const ENERGY_CONSUMPTION_VALEUR_NON_RENSEIGNEE = 0;
    export const GREENHOUSE_GASES_EMISSION_VALEUR_NON_RENSEIGNEE = 0;

    export type ConsommationEnergetique = string | typeof ENERGY_CONSUMPTION_VALEUR_NON_RENSEIGNEE;
    export type EmissionDeGazAEffetDeSerre = string | typeof GREENHOUSE_GASES_EMISSION_VALEUR_NON_RENSEIGNEE

    export type AnnonceDeLogement = {
        id: string | number
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
        energy_consumption: ConsommationEnergetique
        greenhouse_gases_emission: EmissionDeGazAEffetDeSerre
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
}
