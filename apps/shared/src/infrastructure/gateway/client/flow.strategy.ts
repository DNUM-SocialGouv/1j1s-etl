import { Flux } from "@shared/src/domain/model/flux";
import { Logger } from "@shared/src/infrastructure/configuration/logger";

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
