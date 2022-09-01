import { Configuration } from "@extraction/configuration/configuration";
import { Flux } from "@extraction/domain/flux";

export interface FlowStrategy {
	get(flow: Flux): Promise<string>;
}

export interface FlowClient {
	pull(url: string): Promise<string>;
}

export class OnFlowNameStrategy implements FlowStrategy {
	constructor(
		private readonly configuration: Configuration,
		private readonly basicFlowHttpClient: FlowClient,
		private readonly compressedFlowHttpClient: FlowClient,
		private readonly octetStreamFlowHttpClient: FlowClient,
	) {
	}

	async get(flow: Flux): Promise<string> {
		switch (flow.nom) {
			case this.configuration.JOBTEASER.NAME:
				return this.basicFlowHttpClient.pull(flow.url);
			case this.configuration.STAGEFR_COMPRESSED.NAME:
				return this.compressedFlowHttpClient.pull(flow.url);
			case this.configuration.STAGEFR_UNCOMPRESSED.NAME:
				return this.octetStreamFlowHttpClient.pull(flow.url);
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
