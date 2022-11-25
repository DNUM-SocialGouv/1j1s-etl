import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@evenements/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@evenements/transformation/configuration/gateways.container";
import { TaskContainer, TaskContainerFactory } from "@evenements/transformation/configuration/tasks.container";
import { EvenementsTransformationLoggerStrategy } from "@evenements/transformation/configuration/logger-strategy";
import { UseCaseContainerFactory } from "@evenements/transformation/configuration/usecases.container";

export class TransformationModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new EvenementsTransformationLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const useCaseContainer = UseCaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, useCaseContainer);
	}
}
