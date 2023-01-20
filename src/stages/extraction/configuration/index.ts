import { Configuration, ConfigurationFactory } from "@stages/extraction/configuration/configuration";
import { ExtractFluxJobteaserTask } from "@stages/extraction/infrastructure/tasks/extract-flux-jobteaser.task";
import {
	ExtractFluxStagefrCompressedTask,
} from "@stages/extraction/infrastructure/tasks/extract-flux-stagefr-compressed.task";
import {
	ExtractFluxStagefrUncompressedTask,
} from "@stages/extraction/infrastructure/tasks/extract-flux-stagefr-uncompressed.task";
import { GatewayContainerFactory } from "@stages/extraction/configuration/gateways.container";
import { Module } from "@shared/configuration/module";
import { StagesExtractionLoggerStrategy } from "@stages/extraction/configuration/logger.strategy";
import { UsecaseContainer } from "@stages/extraction/usecase";
import { UsecaseContainerFactory } from "@stages/extraction/configuration/usecases.container";

export class ExtractionModule {
	public static export(): Module {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesExtractionLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return ExtractionModule.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): Module {
		return {
			jobteaser: new ExtractFluxJobteaserTask(usecases.extraireJobteaser, configuration),
			"stagefr-compresse": new ExtractFluxStagefrCompressedTask(usecases.extraireStagefrCompresse, configuration),
			"stagefr-decompresse": new ExtractFluxStagefrUncompressedTask(usecases.extraireStagefrDecompresse, configuration),
		};
	}
}

