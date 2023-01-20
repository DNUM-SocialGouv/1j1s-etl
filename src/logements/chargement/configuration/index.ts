import { Configuration, ConfigurationFactory } from "@logements/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@logements/chargement/configuration/gateways.container";
import { LoadImmojeuneTask } from "@logements/chargement/infrastructure/tasks/load-immojeune.task";
import { LoadStudapartTask } from "@logements/chargement/infrastructure/tasks/load-studapart.task";
import { LogementsChargementLoggerStrategy } from "@logements/chargement/configuration/logger-strategy";
import { Module } from "@shared/configuration/module";
import { UsecaseContainer } from "@logements/chargement/usecase";
import { UseCaseContainerFactory } from "@logements/chargement/configuration/usecase.container";

export class LoadModule {
    public static export(): Module {
        const configuration = ConfigurationFactory.create();
        const loggerStrategy = new LogementsChargementLoggerStrategy(configuration);
        const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
        const usecases = UseCaseContainerFactory.create(gateways);
        return LoadModule.create(configuration, usecases);
    }

    private static create(configuration: Configuration, usecases: UsecaseContainer): Module {
        return {
            immojeune: new LoadImmojeuneTask(usecases.immojeune, configuration),
            studapart: new LoadStudapartTask(usecases.studapart, configuration),
        };
    }
}
