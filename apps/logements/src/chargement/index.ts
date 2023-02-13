import { Module } from "@nestjs/common";

import { Configuration, ConfigurationFactory } from "@logements/src/chargement/configuration/configuration";
import { GatewayContainerFactory } from "@logements/src/chargement/configuration/gateways.container";
import { LoadImmojeuneTask } from "@logements/src/chargement/infrastructure/tasks/load-immojeune.task";
import { LoadStudapartTask } from "@logements/src/chargement/infrastructure/tasks/load-studapart.task";
import { LogementsChargementLoggerStrategy } from "@logements/src/chargement/configuration/logger-strategy";
import { SousModule } from "@shared/src/configuration/module";
import { UsecaseContainer } from "@logements/src/chargement/application-service";
import { UseCaseContainerFactory } from "@logements/src/chargement/configuration/usecase.container";

@Module({
	providers: [{
		provide: LoadImmojeuneTask,
		useValue: Chargement.export()["immojeune"],
	}, {
		provide: LoadStudapartTask,
		useValue: Chargement.export()["studapart"],
	}],
	exports: [LoadImmojeuneTask, LoadStudapartTask],
})
export class Chargement {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new LogementsChargementLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UseCaseContainerFactory.create(gateways);
		return Chargement.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
		return {
			immojeune: new LoadImmojeuneTask(usecases.immojeune, configuration),
			studapart: new LoadStudapartTask(usecases.studapart, configuration),
		};
	}
}
