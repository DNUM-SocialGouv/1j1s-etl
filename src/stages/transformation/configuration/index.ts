import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@stages/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@stages/transformation/configuration/gateways.container";
import { StagesTransformationLoggerStrategy } from "@stages/transformation/configuration/logger-strategy";
import { TaskContainer, TaskContainerFactory } from "@stages/transformation/configuration/tasks.container";
import { UsecaseContainerFactory } from "@stages/transformation/configuration/usecases.container";

export class TransformationModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesTransformationLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
