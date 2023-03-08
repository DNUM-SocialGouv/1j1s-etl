import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@stages/src/extraction/application-service";
import { ExtraireJobteaser } from "@stages/src/extraction/application-service/extraire-jobteaser.usecase";
import {
	ExtraireStagefrCompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-compresse.usecase";
import {
	ExtraireStagefrDecompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-decompresse.usecase";
import { Configuration, ConfigurationFactory } from "@stages/src/extraction/infrastructure/configuration/configuration";
import { ExtractFlowJobteaserSubCommand } from "@stages/src/extraction/infrastructure/sub-command/extract-flow-jobteaser.sub-command";
import {
	ExtractFlowStagefrCompressedSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-stagefr-compressed.sub-command";
import {
	ExtractFlowStagefrUncompressedSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-stagefr-uncompressed.sub-command";

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
			provide: ExtractFlowJobteaserSubCommand,
			inject: [ConfigService, ExtraireJobteaser],
			useFactory: (configurationService: ConfigService, usecase: ExtraireJobteaser): ExtractFlowJobteaserSubCommand => {
				return new ExtractFlowJobteaserSubCommand(usecase, configurationService.get<Configuration>("stagesExtraction"));
			},
		},
		{
			provide: ExtractFlowStagefrCompressedSubCommand,
			inject: [ConfigService, ExtraireStagefrCompresse],
			useFactory: (configurationService: ConfigService, usecase: ExtraireStagefrCompresse): ExtractFlowStagefrCompressedSubCommand => {
				return new ExtractFlowStagefrCompressedSubCommand(usecase, configurationService.get<Configuration>("stagesExtraction"));
			},
		},
		{
			provide: ExtractFlowStagefrUncompressedSubCommand,
			inject: [ConfigService, ExtraireStagefrDecompresse],
			useFactory: (configurationService: ConfigService, usecase: ExtraireStagefrDecompresse): ExtractFlowStagefrUncompressedSubCommand => {
				return new ExtractFlowStagefrUncompressedSubCommand(usecase, configurationService.get<Configuration>("stagesExtraction"));
			},
		},
	],
	exports: [ExtractFlowJobteaserSubCommand, ExtractFlowStagefrCompressedSubCommand, ExtractFlowStagefrUncompressedSubCommand],
})
export class Extraction {
}
