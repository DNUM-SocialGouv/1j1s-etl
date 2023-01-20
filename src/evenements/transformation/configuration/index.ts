import { Configuration, ConfigurationFactory } from "@evenements/transformation/configuration/configuration";
import { EvenementsTransformationLoggerStrategy } from "@evenements/transformation/configuration/logger-strategy";
import { GatewayContainerFactory } from "@evenements/transformation/configuration/gateways.container";
import { Module } from "@shared/configuration/module";
import {
	TransformFlowJobteaserTask,
} from "@evenements/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";
import { UseCaseContainer } from "@evenements/transformation/usecase";
import { UseCaseContainerFactory } from "@evenements/transformation/configuration/usecases.container";

export class TransformationModule {
	public static export(): Module {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new EvenementsTransformationLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const useCaseContainer = UseCaseContainerFactory.create(gateways);
		return TransformationModule.create(configuration, useCaseContainer);
	}

	private static create(configuration: Configuration, useCaseContainer: UseCaseContainer): Module {
		return {
			"tous-mobilises": new TransformFlowJobteaserTask(useCaseContainer.transformerFluxTousMobilisesUsecase, configuration),
		};
	}
}
