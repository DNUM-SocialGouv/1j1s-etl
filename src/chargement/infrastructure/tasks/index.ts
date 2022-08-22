import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { GatewayContainerFactory } from "@chargement/configuration/gateways.container";
import { TaskContainer, TaskContainerFactory } from "@chargement/configuration/tasks.container";
import { UsecaseContainerFactory } from "@chargement/configuration/usecases.container";

export class ChargementModule {
	static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const gateways = GatewayContainerFactory.create(configuration);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
