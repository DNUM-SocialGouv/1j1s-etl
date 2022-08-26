import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@transformation/configuration/configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { TaskContainer, TaskContainerFactory } from "@transformation/configuration/tasks.container";
import { UsecaseContainerFactory } from "@transformation/configuration/usecases.container";

export class TransformationModule {
	static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const gateways = GatewayContainerFactory.create(configuration);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
