import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import { UsecaseContainer } from "@transformation/usecase";
import { DateService } from "@shared/date.service";
import { Jobteaser } from "@transformation/domain/jobteaser";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();
		const correspondanceDomainesJobteaser = new Jobteaser.CorrespondanceDomaine();
		const convertirOffreDeStageJobteaser = new Jobteaser.ConvertirOffreDeStage(dateService, correspondanceDomainesJobteaser);

		return {
			transformerFluxJobteaser: new TransformerFluxJobteaser(dateService, gateways.storages.storageClient, convertirOffreDeStageJobteaser),
		};
	}
}
