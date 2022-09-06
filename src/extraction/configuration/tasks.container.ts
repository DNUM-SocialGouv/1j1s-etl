import { Configuration } from "@extraction/configuration/configuration";
import { ExtractFluxJobteaserTask } from "@extraction/infrastructure/tasks/extract-flux-jobteaser.task";
import {
	ExtractFluxStagefrCompressedTask,
} from "@extraction/infrastructure/tasks/extract-flux-stagefr-compressed.task";
import {
	ExtractFluxStagefrUncompressedTask,
} from "@extraction/infrastructure/tasks/extract-flux-stagefr-uncompressed.task";
import { UsecaseContainer } from "@extraction/usecase";

export type TaskContainer = {
	jobteaser: ExtractFluxJobteaserTask
	"stagefr-compresse": ExtractFluxStagefrCompressedTask
	"stagefr-decompresse": ExtractFluxStagefrUncompressedTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			jobteaser: new ExtractFluxJobteaserTask(usecases.extraireJobteaser, configuration),
			"stagefr-compresse": new ExtractFluxStagefrCompressedTask(usecases.extraireStagefrCompresse, configuration),
			"stagefr-decompresse": new ExtractFluxStagefrUncompressedTask(usecases.extraireStagefrDecompresse, configuration),
		};
	}
}
