import { Flux } from "@stages/extraction/domain/flux";
import { Logger } from "@shared/configuration/logger";

export interface FlowStrategy {
	get(flow: Flux, logger: Logger): Promise<string>;
}

export interface FlowClient {
	pull(url: string, logger: Logger): Promise<string>;
}

export class FluxNonGereErreur extends Error {
	constructor(nomDuFlux: string) {
		super(`Le flux ${nomDuFlux} n'est pas actuellement géré`);
	}
}
