import { Configuration } from "@chargement/configuration/configuration";
import { LoadJobteaserTask } from "@chargement/infrastructure/tasks/load-jobteaser.task";
import { LoadStagefrCompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-compressed.task";
import { LoadStagefrUncompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-uncompressed.task";
import { LoggerFactory } from "@shared/logger.factory";
import { UsecaseContainer } from "@chargement/usecase";

export type TaskContainer = {
	jobteaser: LoadJobteaserTask,
	"stagefr-compresse": LoadStagefrCompressedTask,
	"stagefr-decompresse": LoadStagefrUncompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const loadJobteaserLogger = LoggerFactory.create({
			name: configuration.JOBTEASER.NAME,
			logLevel: configuration.JOBTEASER.LOGGER_LOG_LEVEL
		});
		const loadStagefrCompressedLogger = LoggerFactory.create({
			name: configuration.STAGEFR_COMPRESSED.NAME,
			logLevel: configuration.STAGEFR_COMPRESSED.LOGGER_LOG_LEVEL
		});
		const loadStagefrUncompressedLogger = LoggerFactory.create({
			name: configuration.STAGEFR_UNCOMPRESSED.NAME,
			logLevel: configuration.STAGEFR_UNCOMPRESSED.LOGGER_LOG_LEVEL
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
