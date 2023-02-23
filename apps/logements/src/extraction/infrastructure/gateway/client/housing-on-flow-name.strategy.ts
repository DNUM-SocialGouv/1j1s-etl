import { Configuration } from "@logements/src/extraction/configuration/configuration";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";

import { Logger } from "@shared/src/configuration/logger";
import { FlowClient, FlowStrategy, FluxNonGereErreur } from "@shared/src/infrastructure/gateway/client/flow.strategy";

export class HousingsOnFlowNameStrategy implements FlowStrategy {
	constructor(
		private readonly configuration: Configuration,
		private readonly housingsBasicFlowHttpClient: FlowClient,
		private readonly studapartFtpClient: FlowClient,
	) {
	}

	public async get(flow: FluxExtraction, logger: Logger): Promise<string> {
		switch (flow.nom) {
			case this.configuration.IMMOJEUNE.NAME:
				return this.housingsBasicFlowHttpClient.pull(flow.url, logger);
			case this.configuration.STUDAPART.NAME:
				return this.studapartFtpClient.pull(flow.url, logger);
			default:
				throw new FluxNonGereErreur(flow.nom);
		}
	}
}
