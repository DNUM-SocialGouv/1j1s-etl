import { FluxRepository } from "@stages/src/extraction/domain/service/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
