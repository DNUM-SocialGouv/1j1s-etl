import { Module } from "@nestjs/common";

import { Configuration, ConfigurationFactory } from "@stages/src/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@stages/src/transformation/configuration/gateways.container";
import { SousModule } from "@shared/src/configuration/module";
import { StagesTransformationLoggerStrategy } from "@stages/src/transformation/configuration/logger-strategy";
import { TransformFlowJobteaserTask } from "@stages/src/transformation/infrastructure/tasks/transform-flow-jobteaser.task";
import {
	TransformFlowStagefrCompressedTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-stagefr-compressed.task";
import {
	TransformFlowStagefrUncompressedTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-stagefr-uncompressed.task";
import { UsecaseContainer } from "@stages/src/transformation/application-service";
import { UsecaseContainerFactory } from "@stages/src/transformation/configuration/usecases.container";

@Module({
	providers: [
		{ provide: TransformFlowJobteaserTask, useValue: Transformation.export()["jobteaser"] },
		{ provide: TransformFlowStagefrCompressedTask, useValue: Transformation.export()["stagefr-compresse"] },
		{ provide: TransformFlowStagefrUncompressedTask, useValue: Transformation.export()["stagefr-decompresse"] },
	],
	exports: [
		TransformFlowJobteaserTask,
		TransformFlowStagefrCompressedTask,
		TransformFlowStagefrUncompressedTask,
	],
})
export class Transformation {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const loggerStrategy = new StagesTransformationLoggerStrategy(configuration);
		const gateways = GatewayContainerFactory.create(configuration, loggerStrategy);
		const usecases = UsecaseContainerFactory.create(gateways);
		return Transformation.create(configuration, usecases);
	}

	private static create(configuration: Configuration, usecases: UsecaseContainer): SousModule {
		return {
			jobteaser: new TransformFlowJobteaserTask(usecases.transformerFluxJobteaser, configuration),
			"stagefr-compresse": new TransformFlowStagefrCompressedTask(usecases.transformerFluxStagefrCompresse, configuration),
			"stagefr-decompresse": new TransformFlowStagefrUncompressedTask(usecases.transformerFluxStagefrDecompresse, configuration),
		};
	}
}
