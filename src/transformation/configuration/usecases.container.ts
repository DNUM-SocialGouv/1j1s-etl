import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import { UsecaseContainer } from "@transformation/usecase";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();
		const convertirOffreDeStageJobteaser = new Jobteaser.Convertir(dateService);

		return {
			transformerFluxJobteaser: new TransformerFluxJobteaser(dateService, gateways.storages.storageClient, convertirOffreDeStageJobteaser),
		};
	}
}
