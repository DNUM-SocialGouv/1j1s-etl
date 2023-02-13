import { Module } from "@nestjs/common";

import { ChargementUseCaseContainer } from "@evenements/src/chargement/application-service";
import { Configuration, ConfigurationFactory } from "@evenements/src/chargement/configuration/configuration";
import { EvenementsChargementLoggerStrategy } from "@evenements/src/chargement/configuration/logger-strategy";
import { GatewayContainerFactory } from "@evenements/src/chargement/configuration/gateways.container";
import { LoadTousMobilisesTask } from "@evenements/src/chargement/infrastructure/tasks/load-tous-mobilises.task";
import { SousModule } from "@shared/src/configuration/module";
import { UseCaseContainerFactory } from "@evenements/src/chargement/configuration/usecases.container";

@Module({
	providers: [{
		provide: LoadTousMobilisesTask,
		useValue: Chargement.export()["tous-mobilises"],
	}],
	exports: [LoadTousMobilisesTask],
})
export class Chargement {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new EvenementsChargementLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UseCaseContainerFactory.create(gateways);
		return Chargement.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: ChargementUseCaseContainer): SousModule {
		return {
			"tous-mobilises": new LoadTousMobilisesTask(usecases.chargerFluxTousMobilisesUseCase, configuration),
		};
	}
}
