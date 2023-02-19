import { Configuration } from "@stages/src/extraction/configuration/configuration";
import { FlowClient, FlowStrategy, FluxNonGereErreur } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Logger } from "@shared/src/configuration/logger";

export class StagesOnFlowNameStrategy implements FlowStrategy {
	constructor(
		private readonly configuration: Configuration,
		private readonly basicFlowHttpClient: FlowClient,
		private readonly compressedFlowHttpClient: FlowClient,
		private readonly octetStreamFlowHttpClient: FlowClient,
	) {
	}

	public async get(flow: FluxExtraction, logger: Logger): Promise<string> {
		switch (flow.nom) {
			case this.configuration.JOBTEASER.NAME:
				return this.basicFlowHttpClient.pull(flow.url, logger);
			case this.configuration.STAGEFR_COMPRESSED.NAME:
				return this.compressedFlowHttpClient.pull(flow.url, logger);
			case this.configuration.STAGEFR_UNCOMPRESSED.NAME:
				return this.octetStreamFlowHttpClient.pull(flow.url, logger);
			default:
				throw new FluxNonGereErreur(flow.nom);
		}
	}
}