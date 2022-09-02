import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@transformation/configuration/configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { LoggerContainerFactory } from "@transformation/configuration/logger.container";
import { LoggerStrategy } from "@shared/configuration/logger";
import { TaskContainer, TaskContainerFactory } from "@transformation/configuration/tasks.container";
import { UsecaseContainerFactory } from "@transformation/configuration/usecases.container";

export class TransformationModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggers = LoggerContainerFactory.create(configuration);
		const loggerStrategy = new LoggerStrategy(
			loggers.jobteaser,
			loggers["stagefr-compressed"],
			loggers["stagefr-uncompressed"],
		);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases, loggers);
	}
}
