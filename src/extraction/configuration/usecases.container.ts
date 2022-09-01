import { DateService } from "@shared/date.service";
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
			gateways.repositories.flowRepository,
			dateService
		);

		return {
			extraireJobteaser: new ExtraireJobteaser(extraireFluxDomainService),
			extraireStagefrCompresse: new ExtraireStagefrCompresse(extraireFluxDomainService),
			extraireStagefrDecompresse: new ExtraireStagefrDecompresse(extraireFluxDomainService),
		};
	}
}
