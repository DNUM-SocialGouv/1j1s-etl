import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import {
    ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { Configuration, ConfigurationFactory } from "@evenements/src/extraction/configuration/configuration";
import { Usecases } from "@evenements/src/extraction/configuration/usecases.container";
import {
    ExtractFlowTousMobilisesTask,
} from "@evenements/src/extraction/infrastructure/tasks/extract-flow-tous-mobilises.task";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
        Usecases,
    ],
    providers: [{
        provide: ExtractFlowTousMobilisesTask,
        inject: [ConfigService, ExtraireFluxEvenementTousMobilises],
        useFactory: (
            configurationService: ConfigService,
            extraireFluxEvenementTousMobilises: ExtraireFluxEvenementTousMobilises
        ): ExtractFlowTousMobilisesTask => {
            const configuration = configurationService.get<Configuration>("evenementsExtraction");
            return new ExtractFlowTousMobilisesTask(extraireFluxEvenementTousMobilises, configuration);
        },
    }],
    exports: [ExtractFlowTousMobilisesTask],
})
export class Extraction {
}
