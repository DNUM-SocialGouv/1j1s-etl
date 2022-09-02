import { Configuration } from "@transformation/configuration/configuration";
import { LoggerContainer } from "@transformation/configuration/logger.container";
import { TransformFlowJobteaserTask } from "@transformation/infrastructure/tasks/transform-flow-jobteaser.task";
import {
	TransformFlowStagefrCompressedTask,
} from "@transformation/infrastructure/tasks/transform-flow-stagefr-compressed.task";
import {
	TransformFlowStagefrUncompressedTask,
} from "@transformation/infrastructure/tasks/transform-flow-stagefr-uncompressed.task";
import { UsecaseContainer } from "@transformation/usecase";

export type TaskContainer = {
	jobteaser: TransformFlowJobteaserTask
	"stagefr-compresse": TransformFlowStagefrCompressedTask
	"stagefr-decompresse": TransformFlowStagefrUncompressedTask
}

export class TaskContainerFactory {
	public static create(
		configuration: Configuration,
		usecases: UsecaseContainer,
		loggers: LoggerContainer,
	): TaskContainer {
		return {
			jobteaser: new TransformFlowJobteaserTask(usecases.transformerFluxJobteaser, configuration, loggers.jobteaser),
			"stagefr-compresse": new TransformFlowStagefrCompressedTask(usecases.transformerFluxStagefrCompresse, configuration, loggers["stagefr-compressed"]),
			"stagefr-decompresse": new TransformFlowStagefrUncompressedTask(usecases.transformerFluxStagefrDecompresse, configuration, loggers["stagefr-uncompressed"]),
		};
	}
}
