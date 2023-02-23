import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Environment, SentryConfiguration } from "@configuration/src/configuration";

import {
    ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import {
    Configuration,
    ConfigurationFactory,
    MinioConfiguration,
    TaskConfiguration,
} from "@evenements/src/extraction/configuration/configuration";
import { Usecases } from "@evenements/src/extraction/configuration/usecases.container";
import {
    ExtractFlowTousMobilisesTask,
} from "@evenements/src/extraction/infrastructure/tasks/extract-flow-tous-mobilises.task";

import { Domaine, LogLevel } from "@shared/src/configuration/logger";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [ConfigurationFactory.create] }),
        Usecases,
    ],
    providers: [{
        provide: ExtractFlowTousMobilisesTask,
        inject: [ConfigService, ExtraireFluxEvenementTousMobilises],
        useFactory: (
            configurationService: ConfigService,
            extraireFluxEvenementTousMobilises: ExtraireFluxEvenementTousMobilises
        ): ExtractFlowTousMobilisesTask => {
            const moduleConfiguration: Configuration = {
                CONTEXT: configurationService.get<string>("CONTEXT"),
                DOMAINE: configurationService.get<Domaine>("DOMAINE"),
                FLOWS: configurationService.get<Array<string>>("FLOWS"),
                LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
                MINIO: configurationService.get<MinioConfiguration>("MINIO"),
                NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
                SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
                TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
                TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
            };

            return new ExtractFlowTousMobilisesTask(extraireFluxEvenementTousMobilises, moduleConfiguration);
        },
    }],
    exports: [ExtractFlowTousMobilisesTask],
})
export class Extraction {
}
