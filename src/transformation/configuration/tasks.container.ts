import { Configuration } from "@configuration/configuration";
import { LoggerFactory } from "@shared/logger.factory";
import { TransformFluxJobteaserTask } from "@transformation/infrastructure/tasks/transform-flux-jobteaser.task";
import { UsecaseContainer } from "@transformation/usecase";
import { 
	TransformFluxStagefrCompressedTask, 
} from "@transformation/infrastructure/tasks/transform-flux-stagefr-compressed.task";
import {
	TransformFluxStagefrUncompressedTask,
} from "@transformation/infrastructure/tasks/transform-flux-stagefr-uncompressed.task";

export type TaskContainer = {
	jobteaser: TransformFluxJobteaserTask
	"stagefr-decompresse": TransformFluxStagefrUncompressedTask
	"stagefr-compresse": TransformFluxStagefrCompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const stagefrCompresseLogger = LoggerFactory.create(configuration.STAGEFR_COMPRESSED);
		const stagefrDecompresseLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);

		return {
			jobteaser: new TransformFluxJobteaserTask(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
			"stagefr-compresse": new TransformFluxStagefrCompressedTask(
				configuration,
				usecases.transformerFluxStagefrCompresse,
				stagefrCompresseLogger
			),
			"stagefr-decompresse": new TransformFluxStagefrUncompressedTask(
				configuration,
				usecases.transformerFluxStagefrDecompresse,
				stagefrDecompresseLogger
			),
		};
	}
}
