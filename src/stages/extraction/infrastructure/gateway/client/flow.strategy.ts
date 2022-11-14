import { Configuration } from "@stages/extraction/configuration/configuration";
import { Flux } from "@stages/extraction/domain/flux";
import { Logger } from "@shared/configuration/logger";

export interface FlowStrategy {
	get(flow: Flux, logger: Logger): Promise<string>;
}

export interface FlowClient {
	pull(url: string, logger: Logger): Promise<string>;
}

export class OnFlowNameStrategy implements FlowStrategy {
	constructor(
		private readonly configuration: Configuration,
		private readonly basicFlowHttpClient: FlowClient,
		private readonly compressedFlowHttpClient: FlowClient,
		private readonly octetStreamFlowHttpClient: FlowClient,
	) {
	}

	public async get(flow: Flux, logger: Logger): Promise<string> {
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

export class FluxNonGereErreur extends Error {
	constructor(nomDuFlux: string) {
		super(`Le flux ${nomDuFlux} n'est pas actuellement géré`);
	}
}
