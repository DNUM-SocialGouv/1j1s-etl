import { FluxRepository } from "@logements/src/extraction/domain/service/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
