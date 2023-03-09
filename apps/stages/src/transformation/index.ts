import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@stages/src/transformation/application-service";
import {
	TransformerFluxJobteaser,
} from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrCompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { Configuration, ConfigurationFactory } from "@stages/src/transformation/infrastructure/configuration/configuration";
import {
	TransformFlowJobteaserTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-jobteaser.task";
import {
	TransformFlowStagefrCompressedTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-stagefr-compressed.task";
import {
	TransformFlowStagefrUncompressedTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-stagefr-uncompressed.task";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [
		{
			provide: TransformFlowJobteaserTask,
			inject: [ConfigService, TransformerFluxJobteaser],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxJobteaser
			): TransformFlowJobteaserTask => {
				return new TransformFlowJobteaserTask(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
		{
			provide: TransformFlowStagefrCompressedTask,
			inject: [ConfigService, TransformerFluxStagefrCompresse],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxStagefrCompresse
			): TransformFlowStagefrCompressedTask => {
				return new TransformFlowStagefrCompressedTask(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
		{
			provide: TransformFlowStagefrUncompressedTask,
			inject: [ConfigService, TransformerFluxStagefrDecompresse],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxStagefrDecompresse
			): TransformFlowStagefrUncompressedTask => {
				return new TransformFlowStagefrUncompressedTask(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
	],
	exports: [
		TransformFlowJobteaserTask,
		TransformFlowStagefrCompressedTask,
		TransformFlowStagefrUncompressedTask,
	],
})
export class Transformation {
}
