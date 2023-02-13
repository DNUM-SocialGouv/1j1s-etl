import { FluxRepository } from "@evenements/src/extraction/domain/service/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
