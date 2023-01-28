import { FluxRepository } from "@logements/extraction/domain/service/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
