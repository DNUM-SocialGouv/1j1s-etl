import { Domaine as _Domaine } from "@stages/src/transformation/domain/model/hellowork/domaine";

export namespace Hellowork {
	export type Contenu = {
		source: {
			job: Array<OffreDeStage>
		}
	}

	export import Domaine = _Domaine

	export type SalaryDetails = {
		salary_max?: {
			amount?: string
		}
		salary_min?: {
			amount?: string
		}
		periode?: string
	}

	export type OffreDeStage = {
		id: number;
		reference?: string
		date: string
		title: string
		link: string
		company: string
		logo?: string
		publisher?: string
		city?: string
		postalcode?: number
		inseecode?: string
		country?: string
		geoloc?: string
		description?: string
		jobtype?: string
		function?: string
		seodomain?: _Domaine
		category?: string
		salary_details?: SalaryDetails
	}
}
