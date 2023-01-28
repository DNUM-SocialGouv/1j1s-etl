import { Configuration, ConfigurationFactory } from "@evenements/transformation/configuration/configuration";
import { EvenementsTransformationLoggerStrategy } from "@evenements/transformation/configuration/logger-strategy";
import { GatewayContainerFactory } from "@evenements/transformation/configuration/gateways.container";
import { SousModule } from "@shared/configuration/module";
import {
	TransformFlowJobteaserTask,
} from "@evenements/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";
import { UseCaseContainer } from "@evenements/transformation/application-service";
import { UseCaseContainerFactory } from "@evenements/transformation/configuration/usecases.container";

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
			"tous-mobilises": new TransformFlowJobteaserTask(useCaseContainer.transformerFluxTousMobilisesUsecase, configuration),
		};
	}
}
