import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@stages/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@stages/chargement/configuration/gateways.container";
import { LoggerStrategy } from "@stages/chargement/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@stages/chargement/configuration/tasks.container";
import { UsecaseContainerFactory } from "@stages/chargement/configuration/usecases.container";

export class ChargementModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
