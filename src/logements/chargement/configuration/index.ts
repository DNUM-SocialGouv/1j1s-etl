import { TaskContainer, TaskContainerFactory } from "@logements/chargement/configuration/task.container";
import { ConfigurationFactory } from "@logements/chargement/configuration/configuration";
import { LogementsChargementLoggerStrategy } from "@logements/chargement/configuration/logger-strategy";
import { GatewayContainerFactory } from "@logements/chargement/configuration/gateways.container";
import { UseCaseContainerFactory } from "@logements/chargement/configuration/usecase.container";

export class LoadModule {
    public static export(): TaskContainer {
        const configuration = ConfigurationFactory.create();
        const loggerStrategy = new LogementsChargementLoggerStrategy(configuration);
        const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
        const usecases = UseCaseContainerFactory.create(gateways);
        return TaskContainerFactory.create(configuration, usecases);
    }
}
