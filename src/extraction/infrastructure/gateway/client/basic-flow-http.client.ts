import { Axios } from "axios";

import { LectureFluxErreur } from "@extraction/domain/flux.repository";
import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";

export class BasicFlowHttpClient implements FlowClient {
	constructor(private readonly axios: Axios) {
	}

	async fetch(url: string): Promise<string> {
		try {
			return (await this.axios.get<string>(url)).data;
		} catch (e) {
			throw new LectureFluxErreur(url);
		}
	}
}
