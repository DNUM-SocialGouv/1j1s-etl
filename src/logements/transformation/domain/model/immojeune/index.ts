export namespace Immojeune {
	export type AnnonceDeLogement = {
		externalId: string
		url: string
		title: string
		description: string
		type: TypeDeLogement
		property_type: TypeDeBien
		surface: number
		rent: number
		totalPricing: number
		currency: string
		charges: number
		deposit: number
		nbRooms: number
		floor: number
		agenceeFees: number
		availableAt?: string
		energyConsumption: string
		greenhouseGasesEmission: string
		furnished: boolean
		address: string
		city: string
		country: string
		zipCode: string
		latitude: number
		longitude: number
		date_creation?: string
		date_update?: string
		pictures: Array<string>
		includedServices?: Array<ServiceInclus>
		optionalServices?: Array<ServiceOptionnel>
	}

	export enum ServiceInclus {
		BIKE_STORAGE = "bikeStorage",
		CLEANING_TOOLS = "cleaningTools",
		FITNESS_ROOM = "fitnessRoom",
		INTERNET = "internet",
		IRON = "iron",
		MICROWAVE = "microwave",
		PARKING = "parking",
		PRIVATE_BATHROOM = "privateBathroom",
		TV = "tv",
		VACUUM = "vacuum",
		WASHING_MACHINE = "washingMachine",
	}

	export enum ServiceOptionnel {
		BIKE_STORAGE = "bikeStorage",
		CLEANING_TOOLS = "cleaningTools",
		FITNESS_ROOM = "fitnessRoom",
		DEFAULT = "default",
		INTERNET = "internet",
		IRON = "iron",
		MICROWAVE = "microwave",
		TV = "tv",
		VACUUM = "vacuum",
		WASHING_MACHINE = "washingMachine",
	}

	export enum TypeDeLogement {
		COLOCATION = "colocation",
		COURTE = "courte",
		INTERGENERATIONAL = "intergenerational",
		LOCATION = "location",
		RESIDENCE = "residence",
		SUBLEASE = "sublease",
	}

	export enum TypeDeBien {
		APPARTEMENT = "appartement",
		CHAMBRE = "chambre",
		COLOCATION = "colocation",
		IMMEUBLE = "immeuble",
		MAISON = "maison",
		STUDIO = "studio",
		T1 = "t1",
		T1BIS = "t1bis",
		T2 = "t2",
		T3 = "t3",
		T4 = "t4",
		T5 = "t5",
		T6 = "t6",
		T7 = "t7",
		T8 = "t8",
		T9 = "t9",
		T10 = "t10",
		T11 = "t11",
		T12 = "t12",
		T13 = "t13",
		T14 = "t14",
		T15 = "t15",
		T16 = "t16",
		T17 = "t17",
		T18 = "t18",
		T19 = "t19",
		T20 = "t20",
		T21 = "t21",
		T22 = "t22",
		T23 = "t23",
		T24 = "t24",
		T25 = "t25",
	}
}
