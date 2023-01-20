import { Configuration, ConfigurationFactory } from "@stages/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@stages/transformation/configuration/gateways.container";
import { Module } from "@shared/configuration/module";
import { StagesTransformationLoggerStrategy } from "@stages/transformation/configuration/logger-strategy";
import { TransformFlowJobteaserTask } from "@stages/transformation/infrastructure/tasks/transform-flow-jobteaser.task";
import {
	TransformFlowStagefrCompressedTask,
} from "@stages/transformation/infrastructure/tasks/transform-flow-stagefr-compressed.task";
import {
	TransformFlowStagefrUncompressedTask,
} from "@stages/transformation/infrastructure/tasks/transform-flow-stagefr-uncompressed.task";
import { UsecaseContainer } from "@stages/transformation/usecase";
import { UsecaseContainerFactory } from "@stages/transformation/configuration/usecases.container";

export class TransformationModule {
	public static export(): Module {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesTransformationLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return TransformationModule.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): Module {
		return {
			jobteaser: new TransformFlowJobteaserTask(usecases.transformerFluxJobteaser, configuration),
			"stagefr-compresse": new TransformFlowStagefrCompressedTask(usecases.transformerFluxStagefrCompresse, configuration),
			"stagefr-decompresse": new TransformFlowStagefrUncompressedTask(usecases.transformerFluxStagefrDecompresse, configuration),
		};
	}
}
