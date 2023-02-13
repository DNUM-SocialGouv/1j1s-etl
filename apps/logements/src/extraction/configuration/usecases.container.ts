import { DateService } from "@shared/src/date.service";
import { ExtraireFluxDomainService } from "@logements/src/extraction/domain/service/extraire-flux.domain-service";
import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import { GatewayContainer } from "@logements/src/extraction/infrastructure/gateway";
import { UsecaseContainer } from "@logements/src/extraction/application-service";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();

		const extraireFluxDomainService = new ExtraireFluxDomainService(
			gateways.repositories.flowRepository,
			dateService,
		);

		return {
			extraireImmojeune: new ExtraireImmojeune(extraireFluxDomainService),
			extraireStudapart: new ExtraireStudapart(extraireFluxDomainService),
		};
	}
}
