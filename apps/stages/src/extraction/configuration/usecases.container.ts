import { DateService } from "@shared/src/date.service";
import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";
import { ExtraireJobteaser } from "@stages/src/extraction/application-service/extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "@stages/src/extraction/application-service/extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "@stages/src/extraction/application-service/extraire-stagefr-decompresse.usecase";
import { GatewayContainer } from "@stages/src/extraction/infrastructure/gateway";
import { UsecaseContainer } from "@stages/src/extraction/application-service";

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
