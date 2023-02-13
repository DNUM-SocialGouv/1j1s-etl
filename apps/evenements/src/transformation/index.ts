import { Configuration, ConfigurationFactory } from "@evenements/src/transformation/configuration/configuration";
import { EvenementsTransformationLoggerStrategy } from "@evenements/src/transformation/configuration/logger-strategy";
import { GatewayContainerFactory } from "@evenements/src/transformation/configuration/gateways.container";
import { Module } from "@nestjs/common";
import { SousModule } from "@shared/src/configuration/module";
import {
	TransformFlowTousMobilisesTask,
} from "@evenements/src/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";
import { UseCaseContainer } from "@evenements/src/transformation/application-service";
import { UseCaseContainerFactory } from "@evenements/src/transformation/configuration/usecases.container";

@Module({
	providers: [{
		provide: TransformFlowTousMobilisesTask,
		useValue: Transformation.export()["tous-mobilises"],
	}],
	exports: [TransformFlowTousMobilisesTask],
})
export class Transformation {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new EvenementsTransformationLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const useCaseContainer = UseCaseContainerFactory.create(gateways);
		return Transformation.create(configuration, useCaseContainer);
	}

	private static create(configuration: Configuration, useCaseContainer: UseCaseContainer): SousModule {
		return {
			"tous-mobilises": new TransformFlowTousMobilisesTask(useCaseContainer.transformerFluxTousMobilisesUsecase, configuration),
		};
	}
}
