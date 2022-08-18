import { Configuration } from "@configuration/configuration";
import { LoggerFactory } from "@shared/logger.factory";
import { Task } from "@shared/gateway/task";
import { TransformFluxJobteaserTask } from "@transformation/infrastructure/tasks/transform-flux-jobteaser.task";
import { UsecaseContainer } from "@transformation/usecase";
import {
	TransformFluxStagefrUncompressedTask,
} from "@transformation/infrastructure/tasks/transform-flux-stagefr-uncompressed.task";

export type TaskContainer = {
	[transform: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const stagefrDecompresseLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);

		return {
			transform: {
				jobteaser: new TransformFluxJobteaserTask(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
				"stagefr-uncompressed": new TransformFluxStagefrUncompressedTask(
					configuration,
					usecases.transformerFluxStagerfrDecompresse,
					stagefrDecompresseLogger
				),
			},
		};
	}
}
