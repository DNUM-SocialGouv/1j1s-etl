import { FluxRepository } from "@logements/extraction/domain/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
