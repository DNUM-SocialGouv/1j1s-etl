import { Axios } from "axios";

import { Logger } from "@shared/src/configuration/logger";
import { BasicFlowHttpClient } from "@shared/src/infrastructure/gateway/client/basic-flow-http.client";

export class HousingBasicFlowHttpClient extends BasicFlowHttpClient {

	constructor(axios: Axios) {
		super(axios);
	}

	async pull(url: string, logger: Logger): Promise<string> {
		const result = await super.pull(url, logger);

		return JSON.stringify(result);
	}
}
