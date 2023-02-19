import { Axios } from "axios";

import { FlowClient } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { Logger } from "@shared/src/configuration/logger";

export class BasicFlowHttpClient implements FlowClient {
	constructor(private readonly axios: Axios) {
	}

	public async pull(url: string, logger: Logger): Promise<string> {
		try {
			logger.info(`Starting to pull flow from url ${url}`);
			return (await this.axios.get<string>(url)).data;
		} catch (e) {
			throw new LectureFluxErreur(url);
		} finally {
			logger.info(`End of pulling flow from url ${url}`);
		}
	}
}