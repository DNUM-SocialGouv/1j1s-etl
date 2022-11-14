import { DateService } from "@shared/date.service";
import { ExtraireFluxDomainService } from "@stages/extraction/domain/services/extraire-flux.domain-service";
import { ExtraireJobteaser } from "@stages/extraction/usecase/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@stages/extraction/usecase/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "@stages/extraction/usecase/extraire-stagefr-decompresse.usecase";
import { GatewayContainer } from "@stages/extraction/infrastructure/gateway";
import { UsecaseContainer } from "@stages/extraction/usecase";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
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
