import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { UsecaseContainer } from "@transformation/usecase";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
		return {
			some: "toto",
		};
	}
}
