import { Module } from "@nestjs/common";

import { Configuration, ConfigurationFactory } from "@evenements/src/extraction/configuration/configuration";
import { EvenementsExtractionLoggerStrategy } from "@evenements/src/extraction/configuration/logger.strategy";
import {
    ExtractFlowTousMobilisesTask,
} from "@evenements/src/extraction/infrastructure/tasks/extract-flow-tous-mobilises.task";
import { GatewayContainerFactory } from "@evenements/src/extraction/configuration/gateways.container";
import { SousModule } from "@shared/src/configuration/module";
import { UsecaseContainer } from "@evenements/src/extraction/application-service";
import { UsecaseContainerFactory } from "@evenements/src/extraction/configuration/usecases.container";

@Module({
    providers: [{
        provide: ExtractFlowTousMobilisesTask,
        useValue: Extraction.export()["tous-mobilises"],
    }],
    exports: [ExtractFlowTousMobilisesTask],
})
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
            "tous-mobilises": new ExtractFlowTousMobilisesTask(usecases.extraireEvenementsTousMobilises, configuration),
        };
    }
}
