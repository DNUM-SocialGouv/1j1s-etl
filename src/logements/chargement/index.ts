import { Configuration, ConfigurationFactory } from "@logements/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@logements/chargement/configuration/gateways.container";
import { LoadImmojeuneTask } from "@logements/chargement/infrastructure/tasks/load-immojeune.task";
import { LoadStudapartTask } from "@logements/chargement/infrastructure/tasks/load-studapart.task";
import { LogementsChargementLoggerStrategy } from "@logements/chargement/configuration/logger-strategy";
import { SousModule } from "@shared/configuration/module";
import { UsecaseContainer } from "@logements/chargement/application-service";
import { UseCaseContainerFactory } from "@logements/chargement/configuration/usecase.container";

export class Chargement {
    public static export(): SousModule {
        const configuration = ConfigurationFactory.create();
        const loggerStrategy = new LogementsChargementLoggerStrategy(configuration);
        const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
        const usecases = UseCaseContainerFactory.create(gateways);
        return Chargement.create(configuration, usecases);
    }

    private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
        return {
            immojeune: new LoadImmojeuneTask(usecases.immojeune, configuration),
            studapart: new LoadStudapartTask(usecases.studapart, configuration),
        };
    }
}
