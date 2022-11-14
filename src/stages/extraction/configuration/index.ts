import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@stages/extraction/configuration/configuration";
import { GatewayContainerFactory } from "@stages/extraction/configuration/gateways.container";
import { LoggerStrategy } from "@stages/extraction/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@stages/extraction/configuration/tasks.container";
import { UsecaseContainerFactory } from "@stages/extraction/configuration/usecases.container";

export class ExtractionModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}

