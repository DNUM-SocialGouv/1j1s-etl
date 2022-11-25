import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@evenements/transformation/infrastructure/gateway";
import { UseCaseContainer } from "@evenements/transformation/usecase";
import {
	TransformerFluxTousMobilisesUsecase,
} from "@evenements/transformation/usecase/transformer-flux-tous-mobilises.usecase";

export class UseCaseContainerFactory {
	public static create(gateways: GatewayContainer): UseCaseContainer {
		const dateService = new DateService();

		return {
			transformerFluxTousMobilisesUsecase: new TransformerFluxTousMobilisesUsecase(
				gateways.evenementsRepository,
				dateService
			),
		};
	}
}
