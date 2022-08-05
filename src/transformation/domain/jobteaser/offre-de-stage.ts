export type Contenu = {
	jobs: {
		job: Array<OffreDeStage>
	}
}

export type OffreDeStage = {
	reference: string,
	date_created: string,
	company: Employeur,
	title: string,
	mission: string,
	contract?: Contrat,
	domains: {
		domain: string | Array<string>
	},
	languages: {
		language: Array<{ name: string }>
	},
	education: string,
	location: Localisation,
	start_date: string,
	expiration_date: string,
	external_url: string,
}

export type Employeur = {
	name: string,
	website: string,
	domain: string,
	description?: string,
	logo: string
}

export type Localisation = {
	city: string,
	zipcode: string,
	department: string,
	state: string,
	country: string
}

type Contrat = {
	name: string,
	duration?: Duree
}

export type Duree = {
	amount?: string,
	type?: string
}
