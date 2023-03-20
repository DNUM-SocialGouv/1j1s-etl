import { AxiosInstance } from "axios";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

type StrapiQueryParams = {
	"pagination[page]": number,
	"filters[source][$eq]"?: string,
	"fields": string,
	"pagination[pageSize]": number,
	"sort": string,
	"populate": string
}

export type StrapiBodyResponse<T> = { id: number, attributes: T }

export type StrapiResponse<T> = {
	data: Array<StrapiBodyResponse<T>>
	meta: {
		pagination: {
			page: number
			pageSize: number
			pageCount: number
			total: number
		}
	}
}

export class StrapiHttpClient {
	private static readonly OCCURENCIES_PER_PAGE = 100;

	constructor(private readonly axios: AxiosInstance, private readonly authenticationClient: AuthenticationClient) {
	}

	public async get<T>(endpoint: string, fieldsToRetrieve: string, relationsToRetrieve: string, source?: string): Promise<Array<T>> {
		await this.authenticationClient.handleAuthentication(this.axios);

		const firstPage = 1;
		const response = await this.axios.get<StrapiResponse<T>>(endpoint, {
			params: this.buildParams(source, fieldsToRetrieve, relationsToRetrieve, firstPage),
		});
		const firstPageResult = response.data.data.map(this.toRawValues);
		const pageCount = response.data.meta.pagination.pageCount;

		const otherPagesResults = await this.getDataForEachPage<T>(endpoint, source, fieldsToRetrieve, relationsToRetrieve, pageCount);

		return [...firstPageResult, ...otherPagesResults];
	}

	public async delete<T>(endpoint: string, id: string): Promise<void> {
		await this.authenticationClient.handleAuthentication(this.axios);

		await this.axios.delete<StrapiResponse<T>>(`${endpoint}/${id}`);
	}

	private buildParams(source: string, fieldsToRetrieve: string, relationsToRetrieve: string, pageNumber: number): StrapiQueryParams {
		const defaultParams = {
			"pagination[page]": pageNumber,
			"fields": fieldsToRetrieve,
			"populate": relationsToRetrieve,
			"pagination[pageSize]": StrapiHttpClient.OCCURENCIES_PER_PAGE,
		};

		if (source) {
			return {
				...defaultParams,
				"filters[source][$eq]": encodeURI(source),
				"sort": "identifiantSource",
			};
		}

		return { ...defaultParams, "sort": "id" };
	}

	private async getDataForEachPage<T>(url: string, source: string, fieldsToRetrieve: string, relationsToRetrieve: string, pageCount: number): Promise<Array<T>> {
		const data: Array<T> = [];

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			const response = await this.axios.get<StrapiResponse<T>>(url, {
				params: this.buildParams(source, fieldsToRetrieve, relationsToRetrieve, pageNumber),
			});
			data.push(...response.data.data.map(this.toRawValues));
		}

		return data;
	}

	private toRawValues<T>(body: StrapiBodyResponse<T>): T {
		return { id: body.id, ...body.attributes };
	}
}
