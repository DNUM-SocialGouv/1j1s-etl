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
		furnished: 0 | 1
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
		tv?: number
		basement?: number
		dish_washer?: number
		oven?: number
		dryer?: number
		elevator?: number
		garage?: number
		terrace?: number
		optic_fiber?: number
		guardian?: number
		micro_wave?: number
		refrigerator?: number
		washing_machine?: number
		fitness_room?: number
		swimming_pool?: number
	}
}
