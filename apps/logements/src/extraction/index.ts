import { Module } from "@nestjs/common";

import { Configuration, ConfigurationFactory } from "@logements/src/extraction/configuration/configuration";
import { ExtractFlowImmojeuneTask } from "@logements/src/extraction/infrastructure/tasks/extract-flow-immojeune.task";
import { ExtractFlowStudapartTask } from "@logements/src/extraction/infrastructure/tasks/extract-flow-studapart.task";
import { GatewayContainerFactory } from "@logements/src/extraction/configuration/gateways.container";
import { LogementsExtractionLoggerStrategy } from "@logements/src/extraction/configuration/logger.strategy";
import { SousModule } from "@shared/src/configuration/module";
import { UsecaseContainer } from "@logements/src/extraction/application-service";
import { UsecaseContainerFactory } from "@logements/src/extraction/configuration/usecases.container";

@Module({
	providers: [{
		provide: ExtractFlowImmojeuneTask,
		useValue: Extraction.export()["immojeune"],
	}, {
		provide: ExtractFlowStudapartTask,
		useValue: Extraction.export()["studapart"],
	}],
	exports: [ExtractFlowImmojeuneTask, ExtractFlowStudapartTask],
})
export class Extraction {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LogementsExtractionLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return Extraction.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
		return {
			immojeune: new ExtractFlowImmojeuneTask(usecases.extraireImmojeune, configuration),
			studapart: new ExtractFlowStudapartTask(usecases.extraireStudapart, configuration),
		};
	}
}
