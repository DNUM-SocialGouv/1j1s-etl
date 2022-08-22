import { Configuration } from "@configuration/configuration";
import { LoggerFactory } from "@shared/logger.factory";
import { TransformFluxJobteaserTask } from "@transformation/infrastructure/tasks/transform-flux-jobteaser.task";
import { UsecaseContainer } from "@transformation/usecase";
import {
	TransformFluxStagefrUncompressedTask,
} from "@transformation/infrastructure/tasks/transform-flux-stagefr-uncompressed.task";

export type TaskContainer = {
	jobteaser: TransformFluxJobteaserTask
	"stagefr-decompresse": TransformFluxStagefrUncompressedTask
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const stagefrDecompresseLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);

		return {
			jobteaser: new TransformFluxJobteaserTask(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
			"stagefr-decompresse": new TransformFluxStagefrUncompressedTask(
				configuration,
				usecases.transformerFluxStagerfrDecompresse,
				stagefrDecompresseLogger
			),
		};
	}
}
