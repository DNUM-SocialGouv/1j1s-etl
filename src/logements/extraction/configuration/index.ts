import { Configuration, ConfigurationFactory } from "@logements/extraction/configuration/configuration";
import { ExtractFluxImmojeuneTask } from "@logements/extraction/infrastructure/tasks/extract-flux-immojeune.task";
import { ExtractFluxStudapartTask } from "@logements/extraction/infrastructure/tasks/extract-flux-studapart.task";
import { GatewayContainerFactory } from "@logements/extraction/configuration/gateways.container";
import { LogementsExtractionLoggerStrategy } from "@logements/extraction/configuration/logger.strategy";
import { Module } from "@shared/configuration/module";
import { UsecaseContainer } from "@logements/extraction/usecase";
import { UsecaseContainerFactory } from "@logements/extraction/configuration/usecases.container";

export class ExtractionModule {
	public static export(): Module {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LogementsExtractionLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return ExtractionModule.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): Module {
		return {
			immojeune: new ExtractFluxImmojeuneTask(usecases.extraireImmojeune, configuration),
			studapart: new ExtractFluxStudapartTask(usecases.extraireStudapart, configuration),
		};
	}
}
