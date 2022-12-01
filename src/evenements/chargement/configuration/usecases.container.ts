import { GatewayContainer } from "@evenements/chargement/infrastructure/gateway";
import { ChargementUseCaseContainer } from "@evenements/chargement/usecase";
import {
	ChargerEvenenementsDomainService,
} from "@evenements/chargement/domain/1jeune1solution/services/charger-evenements-domain.service";
import { ChargerFluxTousMobilisesUseCase } from "@evenements/chargement/usecase/charger-flux-tous-mobilises.usecase";

export class UseCaseContainerFactory {
	public static create(gateways: GatewayContainer): ChargementUseCaseContainer {
		const chargerEvenenementsDomainService = new ChargerEvenenementsDomainService(
			gateways.evenementsRepository,
		);

		return {
			chargerFluxTousMobilisesUseCase: new ChargerFluxTousMobilisesUseCase(chargerEvenenementsDomainService),
		};
	}
}
