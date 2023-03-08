import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@evenements/src/extraction/application-service";
import {
    ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { Configuration, ConfigurationFactory } from "@evenements/src/extraction/infrastructure/configuration/configuration";
import {
    ExtractFlowTousMobilisesSubCommand,
} from "@evenements/src/extraction/infrastructure/sub-command/extract-flow-tous-mobilises.sub-command";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ConfigurationFactory.createRoot],
            envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
        }),
        Usecases,
    ],
    providers: [{
        provide: ExtractFlowTousMobilisesSubCommand,
        inject: [ConfigService, ExtraireFluxEvenementTousMobilises],
        useFactory: (
            configurationService: ConfigService,
            extraireFluxEvenementTousMobilises: ExtraireFluxEvenementTousMobilises
        ): ExtractFlowTousMobilisesSubCommand => {
            const configuration = configurationService.get<Configuration>("evenementsExtraction");
            return new ExtractFlowTousMobilisesSubCommand(extraireFluxEvenementTousMobilises, configuration);
        },
    }],
    exports: [ExtractFlowTousMobilisesSubCommand],
})
export class Extraction {
}
