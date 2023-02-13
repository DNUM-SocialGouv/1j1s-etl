import { ChargementUseCaseContainer } from "@evenements/src/chargement/application-service";
import {
	ChargerEvenenementsDomainService,
} from "@evenements/src/chargement/domain/service/charger-evenements.domain-service";
import { ChargerFluxTousMobilises } from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { GatewayContainer } from "@evenements/src/chargement/infrastructure/gateway";

export class UseCaseContainerFactory {
	public static create(gateways: GatewayContainer): ChargementUseCaseContainer {
		const chargerEvenenementsDomainService = new ChargerEvenenementsDomainService(
			gateways.evenementsRepository,
		);

		return {
			chargerFluxTousMobilisesUseCase: new ChargerFluxTousMobilises(chargerEvenenementsDomainService),
		};
	}
}
