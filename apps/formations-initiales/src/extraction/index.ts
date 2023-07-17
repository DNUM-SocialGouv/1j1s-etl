import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "./application-service";
import {
  ExtraireFluxFormationsInitialesOnisep,
} from "./application-service/extraire-flux-formations-initiales-onisep.usecase";
import { Configuration, ConfigurationFactory } from "./infrastructure/configuration/configuration";
import {
  ExtractFlowOnisepSubCommand,
} from "./infrastructure/sub-command/extract-flow-onisep.sub-command";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ConfigurationFactory.createRoot],
      envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    }),
    Usecases,
  ],
  providers: [{
    provide: ExtractFlowOnisepSubCommand,
    inject: [ConfigService, ExtraireFluxFormationsInitialesOnisep],
    useFactory: (
      configurationService: ConfigService,
      extractFlowOnisepSubCommand: ExtraireFluxFormationsInitialesOnisep,
    ): ExtractFlowOnisepSubCommand => {
      const configuration = configurationService.get<Configuration>("onisepExtraction");
      return new ExtractFlowOnisepSubCommand(extractFlowOnisepSubCommand, configuration);
    },
  }],
})
export class Extraction {
}
