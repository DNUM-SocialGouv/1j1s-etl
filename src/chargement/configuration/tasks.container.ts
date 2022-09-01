import { Configuration } from "@chargement/configuration/configuration";
import { LoadJobteaserTask } from "@chargement/infrastructure/tasks/load-jobteaser.task";
import { LoadStagefrCompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-compressed.task";
import { LoadStagefrUncompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-uncompressed.task";
import { LoggerFactory } from "@shared/configuration/logger";
import { UsecaseContainer } from "@chargement/usecase";

export type TaskContainer = {
	jobteaser: LoadJobteaserTask,
	"stagefr-compresse": LoadStagefrCompressedTask,
	"stagefr-decompresse": LoadStagefrUncompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const loggerFactory = LoggerFactory.getInstance(configuration.SENTRY_DSN);
		const loadJobteaserLogger = loggerFactory.create({
			name: configuration.JOBTEASER.NAME,
			logLevel: configuration.LOGGER_LOG_LEVEL,
			env: configuration.NODE_ENV,
		});
		const loadStagefrCompressedLogger = loggerFactory.create({
			name: configuration.STAGEFR_COMPRESSED.NAME,
			logLevel: configuration.LOGGER_LOG_LEVEL,
			env: configuration.NODE_ENV,
		});
		const loadStagefrUncompressedLogger = loggerFactory.create({
			name: configuration.STAGEFR_UNCOMPRESSED.NAME,
			logLevel: configuration.LOGGER_LOG_LEVEL,
			env: configuration.NODE_ENV,
		});

		return {
			jobteaser: new LoadJobteaserTask(usecases.chargerFluxJobteaser, loadJobteaserLogger),
			"stagefr-compresse" : new LoadStagefrCompressedTask(
				usecases.chargerFluxStagefrCompresse,
				loadStagefrCompressedLogger,
			),
			"stagefr-decompresse": new LoadStagefrUncompressedTask(
				usecases.chargerFluxStagefrDecompresse,
				loadStagefrUncompressedLogger
			),
		};
	}
}
