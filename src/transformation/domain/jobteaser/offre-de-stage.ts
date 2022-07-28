export type Contenu = {
	jobs: OffreDeStage | Array<OffreDeStage>
}

export type OffreDeStage = {
	reference: string,
	date_created: string,
	company: {
		name: string,
		website: string,
		domain: string,
		description: string,
		logo: string
	},
	title: string,
	mission: string,
	contract: {
		name: string,
		duration: {
			amount: string,
			type: string
		},
	},
	domains: {
		domain: string | Array<string>
	},
	languages: {
		language: Array<{ name: string }>
	},
	education: string,
	location: {
		city: string,
		zipcode: string,
		department: string,
		state: string,
		country: string
	},
	start_date: string,
	expiration_date: string,
	external_url: string,
}
