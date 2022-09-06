import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@extraction/configuration/configuration";
import { GatewayContainerFactory } from "@extraction/configuration/gateways.container";
import { LoggerStrategy } from "@extraction/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@extraction/configuration/tasks.container";
import { UsecaseContainerFactory } from "@extraction/configuration/usecases.container";

export class ExtractionModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}

