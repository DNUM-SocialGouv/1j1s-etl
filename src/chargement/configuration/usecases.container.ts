import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { GatewayContainer } from "@chargement/infrastructure/gateway";
import { UsecaseContainer } from "@chargement/usecase";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
		return {
			chargerFluxJobteaser: new ChargerFluxJobteaser(),
		};
	}
}
