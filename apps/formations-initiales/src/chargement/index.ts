import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@formations-initiales/src/chargement/application-service";
import { ChargerFluxOnisep } from "@formations-initiales/src/chargement/application-service/charger-flux-onisep.usecase";
import { Configuration, ConfigurationFactory } from "@formations-initiales/src/chargement/infrastructure/configuration/configuration";
import {
  LoadFlowOnisepSubCommand,
} from "@formations-initiales/src/chargement/infrastructure/sub-command/load-flow-onisep.sub-command";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ConfigurationFactory.createRoot],
      envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    }),
    Usecases,
  ],
  providers: [{
    provide: LoadFlowOnisepSubCommand,
    inject: [ConfigService, ChargerFluxOnisep],
    useFactory: (configurationService: ConfigService, chargerFluxOnisep: ChargerFluxOnisep): LoadFlowOnisepSubCommand => {
      return new LoadFlowOnisepSubCommand(chargerFluxOnisep, configurationService.get<Configuration>("formationsInitialesChargement"));
    },
  }],
  exports: [
    LoadFlowOnisepSubCommand,
  ],
})
export class Chargement {
}
