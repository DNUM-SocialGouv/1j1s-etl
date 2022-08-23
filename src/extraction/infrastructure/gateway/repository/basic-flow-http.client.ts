import { Axios } from "axios";

import { FluxClient, LectureFluxErreur } from "@extraction/domain/flux.client";

export class BasicFlowHttpClient implements FluxClient {
	constructor(private readonly axios: Axios) {
	}

	async recuperer(url: string): Promise<string> {
		try {
			return (await this.axios.get<string>(url)).data;
		} catch (e) {
			throw new LectureFluxErreur(url);
		}
	}
}
