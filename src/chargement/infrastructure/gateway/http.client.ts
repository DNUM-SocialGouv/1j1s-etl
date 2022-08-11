import { AxiosInstance } from "axios";

import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

export interface HttpClient {
	delete(offreDeStage: UnJeune1Solution.OffreDeStageASupprimer): Promise<void>;
	getAll(source: string): Promise<Array<OffreDeStageHttp>>;
	post(offreDeStage: UnJeune1Solution.OffreDeStageAPublier): Promise<void>;
	put(offreDeStage: UnJeune1Solution.OffreDeStageAMettreAJour): Promise<void>;
}

type StrapiResponse = {
	data: Array<OffreDeStageHttp>
	meta: {
		pagination: {
			page: number
			pageSize: number
			pageCount: number
			total: number
		}
	}
}

export type OffreDeStageHttp = {
	readonly id: string;
	readonly attributes: {
		readonly identifiantSource: string;
		readonly sourceUpdatedAt: string;
	}
}

export class StrapiOffreDeStageHttpClient implements HttpClient {
	static URL_VIDE = "";
	static FIELDS_TO_RETRIEVE = "identifiantSource,id,sourceUpdatedAt";
	static OCCURENCIES_NUMBER_PER_PAGE = 100;

	constructor(private readonly axios: AxiosInstance) {
	}

	delete(offreDeStage: UnJeune1Solution.OffreDeStageASupprimer): Promise<void> {
		return this.axios.delete("/" + offreDeStage.id);
	}

	async getAll(source: string): Promise<Array<OffreDeStageHttp>> {
		const result = await this.axios.get<StrapiResponse>(
			StrapiOffreDeStageHttpClient.URL_VIDE,
			{
				params: {
					"filters[source][$eq]": encodeURI(source),
					"fields": StrapiOffreDeStageHttpClient.FIELDS_TO_RETRIEVE,
					"pagination[pageSize]": StrapiOffreDeStageHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
				},
			},
		);
		const intershipOffers = result.data.data;
		const pageCount = result.data.meta.pagination.pageCount;

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			intershipOffers.push(...
				(await this.axios.get<StrapiResponse>(
					StrapiOffreDeStageHttpClient.URL_VIDE,
					{
						params: {
							"filters[source][$eq]": encodeURI(source),
							"fields": StrapiOffreDeStageHttpClient.FIELDS_TO_RETRIEVE,
							"pagination[page]": pageNumber,
							"pagination[pageSize]": StrapiOffreDeStageHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
						},
					},
				)).data.data
			);
		}

		return intershipOffers;
	}

	post(offreDeStage: UnJeune1Solution.OffreDeStageAPublier): Promise<void> {
		const body = { data: offreDeStage.recupererAttributs() };
		return this.axios.post(StrapiOffreDeStageHttpClient.URL_VIDE, body);
	}

	put(offreDeStage: UnJeune1Solution.OffreDeStageAMettreAJour): Promise<void> {
		return this.axios.put("/" + offreDeStage.id, { data: offreDeStage.recupererAttributs() });
	}
}
