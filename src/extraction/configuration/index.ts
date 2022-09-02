import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@extraction/configuration/configuration";
import { GatewayContainerFactory } from "@extraction/configuration/gateways.container";
import { LoggerContainerFactory } from "@extraction/configuration/logger.container";
import { LoggerStrategy } from "@shared/configuration/logger";
import { TaskContainer, TaskContainerFactory } from "@extraction/configuration/tasks.container";
import { UsecaseContainerFactory } from "@extraction/configuration/usecases.container";

export class ExtractionModule {
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

