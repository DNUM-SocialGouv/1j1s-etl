import { Configuration } from "@configuration/configuration";
import { LoggerFactory } from "@shared/logger.factory";
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
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const stagefrCompresseLogger = LoggerFactory.create(configuration.STAGEFR_COMPRESSED);
		const stagefrDecompresseLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);

		return {
			jobteaser: new TransformFlowJobteaserTask(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
			"stagefr-compresse": new TransformFluxStagefrCompressedTask(
				configuration,
				usecases.transformerFluxStagefrCompresse,
				stagefrCompresseLogger
			),
			"stagefr-decompresse": new TransformFlowStagefrUncompressedTask(
				configuration,
				usecases.transformerFluxStagefrDecompresse,
				stagefrDecompresseLogger
			),
		};
	}
}
