import { AxiosInstance } from "axios";

import { AuthenticationClient } from "@stages/chargement/infrastructure/gateway/authentication.client";
import { UnJeune1Solution } from "@stages/chargement/domain/1jeune1solution";

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
	private static FIELDS_TO_RETRIEVE = "identifiantSource,id,sourceUpdatedAt";
	private static OCCURENCIES_NUMBER_PER_PAGE = 100;

	constructor(
		private readonly axios: AxiosInstance,
		private readonly authClient: AuthenticationClient,
		private readonly offreDeStageUrl: string,
	) {
	}

	public async delete(offreDeStage: UnJeune1Solution.OffreDeStageASupprimer): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		return this.axios.delete(`${this.offreDeStageUrl}/${offreDeStage.id}`);
	}

	public async getAll(source: string): Promise<Array<OffreDeStageHttp>> {
		const result = await this.axios.get<StrapiResponse>(
			this.offreDeStageUrl,
			{
				params: {
					"filters[source][$eq]": encodeURI(source),
					"fields": StrapiOffreDeStageHttpClient.FIELDS_TO_RETRIEVE,
					"pagination[pageSize]": StrapiOffreDeStageHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
					"sort": "identifiantSource",
				},
			},
		);
		const internshipOffers = result.data.data;
		const pageCount = result.data.meta.pagination.pageCount;

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			internshipOffers.push(...
				(await this.axios.get<StrapiResponse>(
					this.offreDeStageUrl,
					{
						params: {
							"filters[source][$eq]": encodeURI(source),
							"fields": StrapiOffreDeStageHttpClient.FIELDS_TO_RETRIEVE,
							"pagination[page]": pageNumber,
							"pagination[pageSize]": StrapiOffreDeStageHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
							"sort": "identifiantSource",
						},
					},
				)).data.data
			);
		}

		return internshipOffers;
	}

	public async post(offreDeStage: UnJeune1Solution.OffreDeStageAPublier): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		const body = { data: offreDeStage.recupererAttributs() };
		return this.axios.post(this.offreDeStageUrl, body);
	}

	public async put(offreDeStage: UnJeune1Solution.OffreDeStageAMettreAJour): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		return this.axios.put(`${this.offreDeStageUrl}/${offreDeStage.id}`, { data: offreDeStage.recupererAttributs() });
	}
}
