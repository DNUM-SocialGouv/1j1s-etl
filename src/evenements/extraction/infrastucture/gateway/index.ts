import { FluxRepository } from "@evenements/extraction/domain/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
