import { ConfigurationFactory } from "@logements/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@logements/transformation/configuration/gateway.container";
import { UsecasesContainerFactor } from "@logements/transformation/configuration/usecases.container";
import { TaskContainer, TaskContainerFactory } from "@logements/transformation/configuration/tasks.container";

export class TransformationModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const gateways = GatewayContainerFactory.create(configuration);
		const usecases = UsecasesContainerFactor.create(gateways);

		return TaskContainerFactory.create(configuration, usecases);
	}
}
