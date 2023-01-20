import "dotenv/config";
import "module-alias/register";

import { Configuration, ConfigurationFactory } from "@stages/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@stages/chargement/configuration/gateways.container";
import { LoadJobteaserTask } from "@stages/chargement/infrastructure/tasks/load-jobteaser.task";
import { LoadStagefrCompressedTask } from "@stages/chargement/infrastructure/tasks/load-stagefr-compressed.task";
import { LoadStagefrUncompressedTask } from "@stages/chargement/infrastructure/tasks/load-stagefr-uncompressed.task";
import { Module } from "@shared/configuration/module";
import { StagesChargementLoggerStrategy } from "@stages/chargement/configuration/logger-strategy";
import { UsecaseContainer } from "@stages/chargement/usecase";
import { UsecaseContainerFactory } from "@stages/chargement/configuration/usecases.container";

export class ChargementModule {
	public static export(): Module {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesChargementLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return ChargementModule.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): Module {
		return {
			jobteaser: new LoadJobteaserTask(usecases.chargerFluxJobteaser, configuration),
			"stagefr-compresse" : new LoadStagefrCompressedTask(usecases.chargerFluxStagefrCompresse, configuration),
			"stagefr-decompresse": new LoadStagefrUncompressedTask(usecases.chargerFluxStagefrDecompresse, configuration),
		};
	}
}
