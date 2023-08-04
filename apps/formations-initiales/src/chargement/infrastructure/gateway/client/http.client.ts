import { AxiosInstance } from "axios";

import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

export interface HttpClient {
	delete(formationInitiale: UnJeuneUneSolution.FormationInitialeASupprimer): Promise<void>;
	getAll(source: string): Promise<Array<FormationInitialeHttp>>;
	post(formationInitiale: UnJeuneUneSolution.FormationInitialeASauvegarder): Promise<void>;
}

type StrapiResponse = {
	data: Array<FormationInitialeHttp>
	meta: {
		pagination: {
			page: number
			pageSize: number
			pageCount: number
			total: number
		}
	}
}

export type FormationInitialeHttp = {
	readonly id: string;
	readonly attributes: {
		readonly identifiant: string;
		readonly sourceUpdatedAt: string;
	}
}

export class StrapiFormationInitialeHttpClient implements HttpClient {
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

	public async getAll(): Promise<Array<FormationInitialeHttp>> {
		const result = await this.axios.get<StrapiResponse>(
			this.formationInitialeUrl,
			{
				params: {
					"fields": StrapiFormationInitialeHttpClient.FIELDS_TO_RETRIEVE,
					"pagination[pageSize]": StrapiFormationInitialeHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
					"sort": "identifiant",
				},
			},
		);
		const formationsInitiales = result.data.data;
		const pageCount = result.data.meta.pagination.pageCount;

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			formationsInitiales.push(...
				(await this.axios.get<StrapiResponse>(
					this.formationInitialeUrl,
					{
						params: {
							"fields": StrapiFormationInitialeHttpClient.FIELDS_TO_RETRIEVE,
							"pagination[page]": pageNumber,
							"pagination[pageSize]": StrapiFormationInitialeHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
							"sort": "identifiant",
						},
					},
				)).data.data
			);
		}

		return formationsInitiales;
	}

	public async post(formationInitiale: UnJeuneUneSolution.FormationInitialeASauvegarder): Promise<void> {
		await this.authClient.handleAuthentication(this.axios);
		const body = { data: formationInitiale.recupererAttributs() };
		return this.axios.post(this.formationInitialeUrl, body);
	}
}
