import { Configuration } from "@configuration/configuration";
import { ExtractFluxJobteaserTask } from "@extraction/infrastructure/tasks/extract-flux-jobteaser.task";
import { ExtractFluxStagefrCompressedTask } from "@extraction/infrastructure/tasks/extract-flux-stagefr-compressed.task";
import {
	ExtractFluxStagefrUncompressedTask,
} from "@extraction/infrastructure/tasks/extract-flux-stagefr-uncompressed.task";
import { LoggerFactory } from "@shared/logger.factory";
import { UsecaseContainer } from "@extraction/usecase";

export type TaskContainer = {
	jobteaser: ExtractFluxJobteaserTask
	"stagefr-compresse": ExtractFluxStagefrCompressedTask
	"stagefr-decompresse": ExtractFluxStagefrUncompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const stagefrCompressedLogger = LoggerFactory.create(configuration.STAGEFR_COMPRESSED);
		const stagefrUncompressedLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);

		return {
			jobteaser: new ExtractFluxJobteaserTask(configuration, usecases.extraireJobteaser, jobteaserLogger),
			"stagefr-compresse": new ExtractFluxStagefrCompressedTask(usecases.extraireStagefrCompresse, configuration, stagefrCompressedLogger),
			"stagefr-decompresse": new ExtractFluxStagefrUncompressedTask(usecases.extraireStagefrDecompresse, configuration, stagefrUncompressedLogger),
		};
	}
}
