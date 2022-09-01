import { Configuration } from "@extraction/configuration/configuration";
import { ExtractFluxJobteaserTask } from "@extraction/infrastructure/tasks/extract-flux-jobteaser.task";
import {
	ExtractFluxStagefrCompressedTask,
} from "@extraction/infrastructure/tasks/extract-flux-stagefr-compressed.task";
import {
	ExtractFluxStagefrUncompressedTask,
} from "@extraction/infrastructure/tasks/extract-flux-stagefr-uncompressed.task";
import { LoggerFactory } from "@shared/configuration/logger";
import { UsecaseContainer } from "@extraction/usecase";

export type TaskContainer = {
	jobteaser: ExtractFluxJobteaserTask
	"stagefr-compresse": ExtractFluxStagefrCompressedTask
	"stagefr-decompresse": ExtractFluxStagefrUncompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const loggerFactory = LoggerFactory.getInstance(configuration.SENTRY_DSN);
		const jobteaserLogger = loggerFactory.create({
			logLevel: configuration.LOGGER_LOG_LEVEL,
			name: configuration.JOBTEASER.NAME,
			env: configuration.NODE_ENV,
		});
		const stagefrCompressedLogger = loggerFactory.create({
			logLevel: configuration.LOGGER_LOG_LEVEL,
			name: configuration.STAGEFR_COMPRESSED.NAME,
			env: configuration.NODE_ENV,
		});
		const stagefrUncompressedLogger = loggerFactory.create({
			logLevel: configuration.LOGGER_LOG_LEVEL,
			name: configuration.STAGEFR_UNCOMPRESSED.NAME,
			env: configuration.NODE_ENV,
		});

		return {
			jobteaser: new ExtractFluxJobteaserTask(usecases.extraireJobteaser, configuration, jobteaserLogger),
			"stagefr-compresse": new ExtractFluxStagefrCompressedTask(usecases.extraireStagefrCompresse, configuration, stagefrCompressedLogger),
			"stagefr-decompresse": new ExtractFluxStagefrUncompressedTask(usecases.extraireStagefrDecompresse, configuration, stagefrUncompressedLogger),
		};
	}
}
