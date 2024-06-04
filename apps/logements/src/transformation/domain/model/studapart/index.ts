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
        full_property_rent_with_charges: string
		charges: string
		rooms?: Array<Room>
		floor_number?: string
		availability_date: string
		energy_consumption: ConsommationEnergetique
		greenhouse_gases_emission: EmissionDeGazAEffetDeSerre
		furnished: BooleanStudapart
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
		tv?: BooleanStudapart
		basement?: BooleanStudapart
		dish_washer?: BooleanStudapart
		oven?: BooleanStudapart
		dryer?: BooleanStudapart
		elevator?: BooleanStudapart
		garage?: BooleanStudapart
		terrace?: BooleanStudapart
		optic_fiber?: BooleanStudapart
		guardian?: BooleanStudapart
		micro_wave?: BooleanStudapart
		refrigerator?: BooleanStudapart
		washing_machine?: BooleanStudapart
		fitness_room?: BooleanStudapart
		swimming_pool?: BooleanStudapart
	}

	export enum BooleanStudapart {
		TRUE = 1,
		FALSE = 0,
	}
}
