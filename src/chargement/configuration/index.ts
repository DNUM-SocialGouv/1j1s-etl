import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@chargement/configuration/configuration";
import { GatewayContainerFactory } from "@chargement/configuration/gateways.container";
import { LoggerStrategy } from "@chargement/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@chargement/configuration/tasks.container";
import { UsecaseContainerFactory } from "@chargement/configuration/usecases.container";

export class ChargementModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
