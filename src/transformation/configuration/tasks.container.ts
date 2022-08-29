import { Configuration } from "@transformation/configuration/configuration";
import { LoggerFactory } from "@shared/configuration/logger";
import { TransformFlowJobteaserTask } from "@transformation/infrastructure/tasks/transform-flow-jobteaser.task";
import {
	TransformFluxStagefrCompressedTask,
} from "@transformation/infrastructure/tasks/transform-flux-stagefr-compressed.task";
import {
	TransformFlowStagefrUncompressedTask,
} from "@transformation/infrastructure/tasks/transform-flow-stagefr-uncompressed.task";
import { UsecaseContainer } from "@transformation/usecase";

export type TaskContainer = {
	jobteaser: TransformFlowJobteaserTask
	"stagefr-compresse": TransformFluxStagefrCompressedTask
	"stagefr-decompresse": TransformFlowStagefrUncompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const jobteaserLogger = LoggerFactory.create({
			logLevel: configuration.JOBTEASER.LOGGER_LOG_LEVEL,
			name: configuration.JOBTEASER.NAME,
		});
		const stagefrCompresseLogger = LoggerFactory.create({
			logLevel: configuration.STAGEFR_COMPRESSED.LOGGER_LOG_LEVEL,
			name: configuration.STAGEFR_COMPRESSED.NAME,
		});
		const stagefrDecompresseLogger = LoggerFactory.create({
			logLevel: configuration.STAGEFR_UNCOMPRESSED.LOGGER_LOG_LEVEL,
			name: configuration.STAGEFR_UNCOMPRESSED.NAME,
		});

		return {
			jobteaser: new TransformFlowJobteaserTask(usecases.transformerFluxJobteaser, configuration, jobteaserLogger),
			"stagefr-compresse": new TransformFluxStagefrCompressedTask(usecases.transformerFluxStagefrCompresse, configuration, stagefrCompresseLogger),
			"stagefr-decompresse": new TransformFlowStagefrUncompressedTask(usecases.transformerFluxStagefrDecompresse, configuration, stagefrDecompresseLogger),
		};
	}
}
