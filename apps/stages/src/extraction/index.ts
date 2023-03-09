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
import { ExtractFlowJobteaserTask } from "@stages/src/extraction/infrastructure/tasks/extract-flow-jobteaser.task";
import {
	ExtractFlowStagefrCompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flow-stagefr-compressed.task";
import {
	ExtractFlowStagefrUncompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flow-stagefr-uncompressed.task";

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
			provide: ExtractFlowJobteaserTask,
			inject: [ConfigService, ExtraireJobteaser],
			useFactory: (configurationService: ConfigService, usecase: ExtraireJobteaser): ExtractFlowJobteaserTask => {
				return new ExtractFlowJobteaserTask(usecase, configurationService.get<Configuration>("stagesExtraction"));
			},
		},
		{
			provide: ExtractFlowStagefrCompressedTask,
			inject: [ConfigService, ExtraireStagefrCompresse],
			useFactory: (configurationService: ConfigService, usecase: ExtraireStagefrCompresse): ExtractFlowStagefrCompressedTask => {
				return new ExtractFlowStagefrCompressedTask(usecase, configurationService.get<Configuration>("stagesExtraction"));
			},
		},
		{
			provide: ExtractFlowStagefrUncompressedTask,
			inject: [ConfigService, ExtraireStagefrDecompresse],
			useFactory: (configurationService: ConfigService, usecase: ExtraireStagefrDecompresse): ExtractFlowStagefrUncompressedTask => {
				return new ExtractFlowStagefrUncompressedTask(usecase, configurationService.get<Configuration>("stagesExtraction"));
			},
		},
	],
	exports: [ExtractFlowJobteaserTask, ExtractFlowStagefrCompressedTask, ExtractFlowStagefrUncompressedTask],
})
export class Extraction {
}
