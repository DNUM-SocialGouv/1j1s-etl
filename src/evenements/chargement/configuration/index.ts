import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@evenements/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@evenements/chargement/configuration/gateways.container";
import { EvenementsChargementLoggerStrategy } from "@evenements/chargement/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@evenements/chargement/configuration/tasks.container";
import { UseCaseContainerFactory } from "@evenements/chargement/configuration/usecases.container";

export class ChargementModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new EvenementsChargementLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UseCaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
