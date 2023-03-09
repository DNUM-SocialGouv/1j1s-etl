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
	TransformFlowImmojeuneTask,
} from "@logements/src/transformation/infrastructure/tasks/transform-flow-immojeune.task";
import {
	TransformFlowStudapartTask,
} from "@logements/src/transformation/infrastructure/tasks/transform-flow-studapart.task";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: TransformFlowImmojeuneTask,
		inject: [ConfigService, TransformerFluxImmojeune],
		useFactory: (
			configurationService: ConfigService,
			transformerFluxImmojeune: TransformerFluxImmojeune
		): TransformFlowImmojeuneTask => {
			return new TransformFlowImmojeuneTask(transformerFluxImmojeune, configurationService.get<Configuration>("transformationLogements"));
		},
	}, {
		provide: TransformFlowStudapartTask,
		inject: [ConfigService, TransformerFluxStudapart],
		useFactory: (
			configurationService: ConfigService,
			transformerFluxStudapart: TransformerFluxStudapart
		): TransformFlowStudapartTask => {
			return new TransformFlowStudapartTask(transformerFluxStudapart, configurationService.get<Configuration>("transformationLogements"));
		},
	}],
	exports: [TransformFlowImmojeuneTask, TransformFlowStudapartTask],
})
export class Transformation {
}
