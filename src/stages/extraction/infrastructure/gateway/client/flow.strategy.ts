import { Configuration } from "@stages/extraction/configuration/configuration";
import { FlowClient, FlowStrategy, FluxNonGereErreur } from "@shared/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@stages/extraction/domain/flux";
import { Logger } from "@shared/configuration/logger";

export class StagesOnFlowNameStrategy implements FlowStrategy {
	constructor(
		private readonly configuration: Configuration,
		private readonly basicFlowHttpClient: FlowClient,
		private readonly compressedFlowHttpClient: FlowClient,
		private readonly octetStreamFlowHttpClient: FlowClient,
		private readonly chunckedHttpClient: FlowClient,
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
			case this.configuration.HELLO_WORK.NAME:
				return this.chunckedHttpClient.pull(flow.url, logger);
			default:
				throw new FluxNonGereErreur(flow.nom);
		}
	}
}
