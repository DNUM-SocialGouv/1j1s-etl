import { Axios } from "axios";

import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@extraction/domain/flux.repository";
import { Logger } from "@shared/configuration/logger";

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
