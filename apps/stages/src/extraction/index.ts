import { Module } from "@nestjs/common";
import { SousModule } from "@shared/src/configuration/module";
import { UsecaseContainer } from "@stages/src/extraction/application-service";
import { Configuration, ConfigurationFactory } from "@stages/src/extraction/configuration/configuration";
import { GatewayContainerFactory } from "@stages/src/extraction/configuration/gateways.container";
import { StagesExtractionLoggerStrategy } from "@stages/src/extraction/configuration/logger.strategy";
import { UsecaseContainerFactory } from "@stages/src/extraction/configuration/usecases.container";
import { ExtractFlowJobteaserTask } from "@stages/src/extraction/infrastructure/tasks/extract-flow-jobteaser.task";
import {
	ExtractFluxStagefrCompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flux-stagefr-compressed.task";
import {
	ExtractFlowStagefrUncompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flow-stagefr-uncompressed.task";

@Module({
	providers: [{
		provide: ExtractFlowJobteaserTask,
		useValue: Extraction.export()["jobteaser"],
	}, {
		provide: ExtractFluxStagefrCompressedTask,
		useValue: Extraction.export()["stagefr-compresse"],
	}, {
		provide: ExtractFlowStagefrUncompressedTask,
		useValue: Extraction.export()["stagefr-decompresse"],
	}],
	exports: [ExtractFlowJobteaserTask, ExtractFluxStagefrCompressedTask, ExtractFlowStagefrUncompressedTask],
})
export class Extraction {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesExtractionLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return Extraction.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
		return {
			jobteaser: new ExtractFlowJobteaserTask(usecases.extraireJobteaser, configuration),
			"stagefr-compresse": new ExtractFluxStagefrCompressedTask(usecases.extraireStagefrCompresse, configuration),
			"stagefr-decompresse": new ExtractFlowStagefrUncompressedTask(usecases.extraireStagefrDecompresse, configuration),
		};
	}
}
