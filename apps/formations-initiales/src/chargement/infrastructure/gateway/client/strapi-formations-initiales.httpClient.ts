import { AxiosInstance, AxiosResponse } from "axios";

import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import { HttpClient } from "@formations-initiales/src/chargement/infrastructure/gateway/client/http.client";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

type StrapiResponse = {
	data: Array<FormationInitialeStrapiExtrait>
	meta: {
		pagination: {
			page: number
			pageSize: number
			pageCount: number
			total: number
		}
	}
}
export type FormationInitialeStrapiExtrait = {
	readonly id: string;
	readonly attributes: {
		readonly identifiant: string;
	}
}

export class StrapiFormationsInitialesHttpClient implements HttpClient {
	private static FIELDS_TO_RETRIEVE = "identifiant,id";
	private static OCCURENCIES_NUMBER_PER_PAGE = 100;

	constructor(
		private readonly axios: AxiosInstance,
		private readonly authClient: AuthenticationClient,
		private readonly formationInitialeUrl: string,
	) {
	}

	public async delete(formationInitiale: UnJeuneUneSolution.FormationInitialeASupprimer): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		return this.axios.delete(`${this.formationInitialeUrl}/${formationInitiale.id}`);
	}

	public async getAll(): Promise<Array<FormationInitialeStrapiExtrait>> {
		const firstPageResult = await this.getFormationsInitialesByPage(1);
		const formationsInitiales = firstPageResult.data.data;
		const pageCount = firstPageResult.data.meta.pagination.pageCount;

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			formationsInitiales.push(...(await this.getFormationsInitialesByPage(pageNumber)).data.data);
		}

		return formationsInitiales;
	}

	private async getFormationsInitialesByPage(pageNumber: number): Promise<AxiosResponse<StrapiResponse>> {
		return await this.axios.get<StrapiResponse>(
			this.formationInitialeUrl,
			{
				params: {
					"fields": StrapiFormationsInitialesHttpClient.FIELDS_TO_RETRIEVE,
					"pagination[page]": pageNumber,
					"pagination[pageSize]": StrapiFormationsInitialesHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
					"sort": "identifiant",
				},
			},
		);
	}

	public async post(formationInitiale: UnJeuneUneSolution.FormationInitialeASauvegarder): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		const body = { data: formationInitiale.recupererAttributs() };
		await this.axios.post(this.formationInitialeUrl, body);
	}
}
