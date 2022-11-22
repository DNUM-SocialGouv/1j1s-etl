import { ConfigurationFactory } from "@logements/extraction/configuration/configuration";
import { TaskContainer, TaskContainerFactory } from "@logements/extraction/configuration/tasks.container";
import { LogementsExtractionLoggerStrategy } from "@logements/extraction/configuration/logger.strategy";
import { GatewayContainerFactory } from "@logements/extraction/configuration/gateways.container";
import { UsecaseContainerFactory } from "@logements/extraction/configuration/usecases.container";

export class ExtractionModule {
	public static export(): TaskContainer {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LogementsExtractionLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TaskContainerFactory.create(configuration, usecases);
	}
}
