import { ConfigurationFactory } from "@evenements/extraction/configuration/configuration";
import { EvenementsExtractionLoggerStrategy } from "@evenements/extraction/configuration/logger.strategy";
import { GatewayContainerFactory } from "@evenements/extraction/configuration/gateways.container";
import { TaskContainer } from "@evenements/extraction/configuration/tasks.container";
import { TaskContainerFactory } from "@evenements/extraction/configuration/tasks.container";
import { UsecaseContainerFactory } from "@evenements/extraction/configuration/usecases.container";

export class ExtractionModule {
    public static export(): TaskContainer {
        const configuration = ConfigurationFactory.create();
        const loggerStrategy = new EvenementsExtractionLoggerStrategy(configuration);
        const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
        const usecases = UsecaseContainerFactory.create(gateways);
        return TaskContainerFactory.create(configuration, usecases);
    }
}
