import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@logements/src/transformation/application-service";
import {
	TransformerFluxImmojeune,
} from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import {
	TransformerFluxStudapart,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import { Configuration, ConfigurationFactory } from "@logements/src/transformation/infrastructure/configuration/configuration";
import {
	TransformFlowImmojeuneSubCommand,
} from "@logements/src/transformation/infrastructure/sub-command/transform-flow-immojeune.sub-command";
import {
	TransformFlowStudapartSubCommand,
} from "@logements/src/transformation/infrastructure/sub-command/transform-flow-studapart.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: TransformFlowImmojeuneSubCommand,
		inject: [ConfigService, TransformerFluxImmojeune],
		useFactory: (
			configurationService: ConfigService,
			transformerFluxImmojeune: TransformerFluxImmojeune
		): TransformFlowImmojeuneSubCommand => {
			return new TransformFlowImmojeuneSubCommand(transformerFluxImmojeune, configurationService.get<Configuration>("transformationLogements"));
		},
	}, {
		provide: TransformFlowStudapartSubCommand,
		inject: [ConfigService, TransformerFluxStudapart],
		useFactory: (
			configurationService: ConfigService,
			transformerFluxStudapart: TransformerFluxStudapart
		): TransformFlowStudapartSubCommand => {
			return new TransformFlowStudapartSubCommand(transformerFluxStudapart, configurationService.get<Configuration>("transformationLogements"));
		},
	}],
	exports: [TransformFlowImmojeuneSubCommand, TransformFlowStudapartSubCommand],
})
export class Transformation {
}
