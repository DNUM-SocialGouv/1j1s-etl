import { Configuration, ConfigurationFactory } from "@evenements/chargement/configuration/configuration";
import { ChargementUseCaseContainer } from "@evenements/chargement/usecase";
import { EvenementsChargementLoggerStrategy } from "@evenements/chargement/configuration/logger-strategy";
import { GatewayContainerFactory } from "@evenements/chargement/configuration/gateways.container";
import { LoadTousMobilisesTask } from "@evenements/chargement/infrastructure/tasks/load-tous-mobilises.task";
import { SousModule } from "@shared/configuration/module";
import { UseCaseContainerFactory } from "@evenements/chargement/configuration/usecases.container";

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
			"tous-mobilises" : new LoadTousMobilisesTask(usecases.chargerFluxTousMobilisesUseCase, configuration),
		};
	}
}
