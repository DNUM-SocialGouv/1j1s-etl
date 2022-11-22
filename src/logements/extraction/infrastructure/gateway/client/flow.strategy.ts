import { Configuration } from "@logements/extraction/configuration/configuration";
import { FlowClient, FlowStrategy, FluxNonGereErreur } from "@shared/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@logements/extraction/domain/flux";
import { Logger } from "@shared/configuration/logger";

export class HousingsOnFlowNameStrategy implements FlowStrategy {
	constructor(
		private readonly configuration: Configuration,
		private readonly housingsBasicFlowHttpClient: FlowClient,
	) {
	}

	public async get(flow: FluxExtraction, logger: Logger): Promise<string> {
		switch (flow.nom) {
			case this.configuration.IMMOJEUNE.NAME:
				return this.housingsBasicFlowHttpClient.pull(flow.url, logger);
			default:
				throw new FluxNonGereErreur(flow.nom);
		}
	}
}
