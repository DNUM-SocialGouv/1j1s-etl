import { FluxRepository } from "@stages/extraction/domain/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
