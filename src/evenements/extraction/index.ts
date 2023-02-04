import { Configuration, ConfigurationFactory } from "@evenements/extraction/configuration/configuration";
import { EvenementsExtractionLoggerStrategy } from "@evenements/extraction/configuration/logger.strategy";
import {
    ExtractFluxEvenementTousMobilisesTask,
} from "@evenements/extraction/infrastructure/tasks/extract-flux-evenement-tous-mobilises.task";
import { GatewayContainerFactory } from "@evenements/extraction/configuration/gateways.container";
import { SousModule } from "@shared/configuration/module";
import { UsecaseContainer } from "@evenements/extraction/application-service";
import { UsecaseContainerFactory } from "@evenements/extraction/configuration/usecases.container";

export class Extraction {
    public static export(): SousModule {
        const configuration = ConfigurationFactory.create();
        const loggerStrategy = new EvenementsExtractionLoggerStrategy(configuration);
        const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
        const usecases = UsecaseContainerFactory.create(gateways);
        return Extraction.create(configuration, usecases);
    }

    private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
        return {
            "tous-mobilises": new ExtractFluxEvenementTousMobilisesTask(usecases.extraireEvenementsTousMobilises, configuration),
        };
    }
}
