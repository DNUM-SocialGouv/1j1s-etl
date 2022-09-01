import { Configuration } from "@transformation/configuration/configuration";
import { LoggerFactory } from "@shared/configuration/logger";
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
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const loggerFactory = LoggerFactory.getInstance(configuration.SENTRY_DSN);
		const jobteaserLogger = loggerFactory.create({
			logLevel: configuration.LOGGER_LOG_LEVEL,
			name: configuration.JOBTEASER.NAME,
			env: configuration.NODE_ENV,
		});
		const stagefrCompresseLogger = loggerFactory.create({
			logLevel: configuration.LOGGER_LOG_LEVEL,
			name: configuration.STAGEFR_COMPRESSED.NAME,
			env: configuration.NODE_ENV,
		});
		const stagefrDecompresseLogger = loggerFactory.create({
			logLevel: configuration.LOGGER_LOG_LEVEL,
			name: configuration.STAGEFR_UNCOMPRESSED.NAME,
			env: configuration.NODE_ENV,
		});

		return {
			jobteaser: new TransformFlowJobteaserTask(usecases.transformerFluxJobteaser, configuration, jobteaserLogger),
			"stagefr-compresse": new TransformFlowStagefrCompressedTask(usecases.transformerFluxStagefrCompresse, configuration, stagefrCompresseLogger),
			"stagefr-decompresse": new TransformFlowStagefrUncompressedTask(usecases.transformerFluxStagefrDecompresse, configuration, stagefrDecompresseLogger),
		};
	}
}
