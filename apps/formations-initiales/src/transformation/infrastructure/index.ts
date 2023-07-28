import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@formations-initiales/src/transformation/application-service";
import {
  TransformerFluxOnisep,
} from "@formations-initiales/src/transformation/application-service/transformer-flux-onisep.usecase";
import {
  ConfigurationFactory,
} from "@formations-initiales/src/transformation/infrastructure/configuration/configuration";
import {
  TransformFlowOnisepSubCommand,
} from "@formations-initiales/src/transformation/infrastructure/sub-command/transform-flow-onisep.sub-command";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ConfigurationFactory.createRoot],
      envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    }),
    Usecases,
  ],
  providers: [{
    provide: TransformFlowOnisepSubCommand,
    inject: [ConfigService, TransformerFluxOnisep],
    useFactory: (
      configurationService: ConfigService,
      transformerFluxOnisep: TransformerFluxOnisep,
    ): TransformFlowOnisepSubCommand => {
      return new TransformFlowOnisepSubCommand(
        transformerFluxOnisep,
        configurationService.get("formationsInitialesTransformation"),
      );
    },
  }],
  exports: [TransformFlowOnisepSubCommand],
})
export class Transformation {
}
