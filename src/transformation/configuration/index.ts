import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@transformation/configuration/configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { LoggerStrategy } from "@transformation/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@transformation/configuration/tasks.container";
import { UsecaseContainerFactory } from "@transformation/configuration/usecases.container";

export class TransformationModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
