import { Configuration, ConfigurationFactory } from "@evenements/extraction/configuration/configuration";
import { EvenementsExtractionLoggerStrategy } from "@evenements/extraction/configuration/logger.strategy";
import {
    ExtractFluxEvenementTousMobilisesTask,
} from "@evenements/extraction/infrastucture/tasks/extract-flux-evenement-tous-mobilites.task";
import { GatewayContainerFactory } from "@evenements/extraction/configuration/gateways.container";
import { Module } from "@shared/configuration/module";
import { UsecaseContainer } from "@evenements/extraction/usecase";
import { UsecaseContainerFactory } from "@evenements/extraction/configuration/usecases.container";

export class ExtractionModule {
    public static export(): Module {
        const configuration = ConfigurationFactory.create();
        const loggerStrategy = new EvenementsExtractionLoggerStrategy(configuration);
        const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
        const usecases = UsecaseContainerFactory.create(gateways);
        return ExtractionModule.create(configuration, usecases);
    }

    private static create(configuration: Configuration, usecases: UsecaseContainer): Module {
        return {
            "tous-mobilises": new ExtractFluxEvenementTousMobilisesTask(usecases.extraireEvenementsTousMobilises, configuration),
        };
    }
}
