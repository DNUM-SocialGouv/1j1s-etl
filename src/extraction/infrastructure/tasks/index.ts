import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { GatewayContainerFactory } from "@extraction/configuration/gateways.container";
import { TaskContainer, TaskContainerFactory } from "@extraction/configuration/tasks.container";
import { UsecaseContainerFactory } from "@extraction/configuration/usecases.container";

export class ExtractionModule {
	static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const gateways = GatewayContainerFactory.create(configuration);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}

