import { DateService } from "@extraction/domain/services/date.service";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { ExtraireJobteaser } from "@extraction/usecase/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@extraction/usecase/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "@extraction/usecase/extraire-stagefr-decompresse.usecase";
import { GatewayContainer } from "@extraction/infrastructure/gateway";
import { UsecaseContainer } from "@extraction/usecase";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();

		const extraireFluxDomainService = new ExtraireFluxDomainService(
			gateways.repositories.fluxClient,
			gateways.storages.storageClient,
			dateService
		);

		const extraireFluxCompresseDomainService = new ExtraireFluxDomainService(
			gateways.repositories.compressedFluxClient,
			gateways.storages.storageClient,
			dateService,
		);

		const extraireFluxDeDonneesContinuDomainService = new ExtraireFluxDomainService(
			gateways.repositories.octetStreamFlowHttpClient,
			gateways.storages.storageClient,
			dateService,
		);

		return {
			extraireJobteaser: new ExtraireJobteaser(extraireFluxDomainService),
			extraireStagefrCompresse: new ExtraireStagefrCompresse(extraireFluxCompresseDomainService),
			extraireStagefrDecompresse: new ExtraireStagefrDecompresse(extraireFluxDeDonneesContinuDomainService),
		};
	}
}