import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@chargement/configuration/configuration";
import { GatewayContainerFactory } from "@chargement/configuration/gateways.container";
import { LoggerContainerFactory } from "@chargement/configuration/logger.container";
import { LoggerStrategy } from "@shared/configuration/logger";
import { TaskContainer, TaskContainerFactory } from "@chargement/configuration/tasks.container";
import { UsecaseContainerFactory } from "@chargement/configuration/usecases.container";

export class ChargementModule {
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
