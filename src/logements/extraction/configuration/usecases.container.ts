import { DateService } from "@shared/date.service";
import { ExtraireFluxDomainService } from "@logements/extraction/domain/services/extraire-flux.domain-service";
import { GatewayContainer } from "@logements/extraction/infrastructure/gateway";
import { UsecaseContainer } from "@logements/extraction/usecase";
import { ExtraireImmojeune } from "@logements/extraction/usecase/extraire-immojeune.usecase";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();

		const extraireFluxDomainService = new ExtraireFluxDomainService(
			gateways.repositories.flowRepository,
			dateService,
		);

		return {
			extraireImmojeune: new ExtraireImmojeune(extraireFluxDomainService),
		};
	}
}
