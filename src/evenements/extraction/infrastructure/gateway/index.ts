import { FluxRepository } from "@evenements/extraction/domain/service/flux.repository";

export type GatewayContainer = {
	repositories: {
		flowRepository: FluxRepository
	}
}
