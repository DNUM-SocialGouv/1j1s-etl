import { Configuration } from "@configuration/configuration";
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
		const loadJobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const loadStagefrUncompressedLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);
		const loadStagefrCompressedLogger = LoggerFactory.create(configuration.STAGEFR_COMPRESSED);

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
