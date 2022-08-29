import { FluxRepository } from "@extraction/domain/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
