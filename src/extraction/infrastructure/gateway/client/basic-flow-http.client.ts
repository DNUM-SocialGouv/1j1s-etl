import { Axios } from "axios";

import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@extraction/domain/flux.repository";

export class BasicFlowHttpClient implements FlowClient {
	constructor(private readonly axios: Axios) {
	}

	public async pull(url: string): Promise<string> {
		try {
			return (await this.axios.get<string>(url)).data;
		} catch (e) {
			throw new LectureFluxErreur(url);
		}
	}
}
