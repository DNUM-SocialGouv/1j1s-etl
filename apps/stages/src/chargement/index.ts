import { Module } from "@nestjs/common";

import { SousModule } from "@shared/src/configuration/module";

import { UsecaseContainer } from "@stages/src/chargement/application-service";
import { Configuration, ConfigurationFactory } from "@stages/src/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@stages/src/chargement/configuration/gateways.container";
import { StagesChargementLoggerStrategy } from "@stages/src/chargement/configuration/logger-strategy";
import { UsecaseContainerFactory } from "@stages/src/chargement/configuration/usecases.container";
import { LoadJobteaserTask } from "@stages/src/chargement/infrastructure/tasks/load-jobteaser.task";
import { LoadStagefrCompressedTask } from "@stages/src/chargement/infrastructure/tasks/load-stagefr-compressed.task";
import { LoadStagefrUncompressedTask } from "@stages/src/chargement/infrastructure/tasks/load-stagefr-uncompressed.task";

@Module({
	providers: [{
		provide: LoadJobteaserTask,
		useValue: Chargement.export()["jobteaser"],
	}, {
		provide: LoadStagefrCompressedTask,
		useValue: Chargement.export()["stagefr-compresse"],
	}, {
		provide: LoadStagefrUncompressedTask,
		useValue: Chargement.export()["stagefr-decompresse"],
	}],
	exports: [
		LoadJobteaserTask,
		LoadStagefrCompressedTask,
		LoadStagefrUncompressedTask,
	],
})
export class Chargement {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesChargementLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return Chargement.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
		return {
			jobteaser: new LoadJobteaserTask(usecases.chargerFluxJobteaser, configuration),
			"stagefr-compresse": new LoadStagefrCompressedTask(usecases.chargerFluxStagefrCompresse, configuration),
			"stagefr-decompresse": new LoadStagefrUncompressedTask(usecases.chargerFluxStagefrDecompresse, configuration),
		};
	}
}

