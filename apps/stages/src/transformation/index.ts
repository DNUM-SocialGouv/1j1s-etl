import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@stages/src/transformation/application-service";
import {
	TransformerFluxHellowork,
} from "@stages/src/transformation/application-service/transformer-flux-hellowork.usecase";
import {
	TransformerFluxJobteaser,
} from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrCompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import {
	Configuration,
	ConfigurationFactory,
} from "@stages/src/transformation/infrastructure/configuration/configuration";
import {
	TransformFlowHelloworkSubCommand,
} from "@stages/src/transformation/infrastructure/sub-command/transform-flow-hellowork.sub-command";
import {
	TransformFlowJobteaserSubCommand,
} from "@stages/src/transformation/infrastructure/sub-command/transform-flow-jobteaser.sub-command";
import {
	TransformFlowStagefrCompressedSubCommand,
} from "@stages/src/transformation/infrastructure/sub-command/transform-flow-stagefr-compressed.sub-command";
import {
	TransformFlowStagefrUncompressedSubCommand,
} from "@stages/src/transformation/infrastructure/sub-command/transform-flow-stagefr-uncompressed.sub-command";

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
			provide: TransformFlowHelloworkSubCommand,
			inject: [ConfigService, TransformerFluxHellowork],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxHellowork
			): TransformFlowHelloworkSubCommand => {
				return new TransformFlowHelloworkSubCommand(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
		{
			provide: TransformFlowJobteaserSubCommand,
			inject: [ConfigService, TransformerFluxJobteaser],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxJobteaser
			): TransformFlowJobteaserSubCommand => {
				return new TransformFlowJobteaserSubCommand(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
		{
			provide: TransformFlowStagefrCompressedSubCommand,
			inject: [ConfigService, TransformerFluxStagefrCompresse],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxStagefrCompresse
			): TransformFlowStagefrCompressedSubCommand => {
				return new TransformFlowStagefrCompressedSubCommand(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
		{
			provide: TransformFlowStagefrUncompressedSubCommand,
			inject: [ConfigService, TransformerFluxStagefrDecompresse],
			useFactory: (
				configurationService: ConfigService,
				usecase: TransformerFluxStagefrDecompresse
			): TransformFlowStagefrUncompressedSubCommand => {
				return new TransformFlowStagefrUncompressedSubCommand(usecase, configurationService.get<Configuration>("stagesTransformation"));
			},
		},
	],
	exports: [
		TransformFlowHelloworkSubCommand,
		TransformFlowJobteaserSubCommand,
		TransformFlowStagefrCompressedSubCommand,
		TransformFlowStagefrUncompressedSubCommand,
	],
})
export class Transformation {
}
