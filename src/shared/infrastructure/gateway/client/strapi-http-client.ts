import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import { AxiosInstance } from "axios";

type StrapiQueryParam = "pagination[page]"
	| "filters[source][$eq]"
	| "fields"
	| "pagination[pageSize]"
	| "sort"
	| "populate"

type StrapiQueryParams = { params: Record<StrapiQueryParam, string | number> }

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

	public async get<T>(url: string, source: string, fieldsToRetrieve: string, relationsToRetrieve: string): Promise<Array<T>> {
		await this.authenticationClient.handleAuthentication(this.axios);

		const firstPage = 1;
		const response = await this.axios.get<StrapiResponse<T>>(url, this.buildParams(source, fieldsToRetrieve, relationsToRetrieve, firstPage));
		const firstPageResult = response.data.data.map(this.toRawValues);
		const pageCount = response.data.meta.pagination.pageCount;

		const otherPagesResults = await this.getDataForEachPage<T>(url, source, fieldsToRetrieve, relationsToRetrieve, pageCount);

		return [...firstPageResult, ...otherPagesResults];
	}

	private buildParams(source: string, fieldsToRetrieve: string, relationsToRetrieve: string, pageNumber: number): StrapiQueryParams {
		return {
			params: {
				"pagination[page]": pageNumber,
				"filters[source][$eq]": encodeURI(source),
				"fields": fieldsToRetrieve,
				"populate": relationsToRetrieve,
				"pagination[pageSize]": StrapiHttpClient.OCCURENCIES_PER_PAGE,
				"sort": "identifiantSource",
			},
		};
	}

	private async getDataForEachPage<T>(url: string, source: string, fieldsToRetrieve: string, relationsToRetrieve: string, pageCount: number): Promise<Array<T>> {
		const data: Array<T> = [];

		for (let pageNumber = 2; pageNumber <= pageCount; pageNumber++) {
			const response = await this.axios.get<StrapiResponse<T>>(url, this.buildParams(source, fieldsToRetrieve, relationsToRetrieve, pageNumber));
			data.push(...response.data.data.map(this.toRawValues));
		}

		return data;
	}

	private toRawValues<T>(body: StrapiBodyResponse<T>): T {
		return { id: body.id, ...body.attributes };
	}
}
