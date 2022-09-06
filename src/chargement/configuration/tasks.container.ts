import { Configuration } from "@chargement/configuration/configuration";
import { LoadJobteaserTask } from "@chargement/infrastructure/tasks/load-jobteaser.task";
import { LoadStagefrCompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-compressed.task";
import { LoadStagefrUncompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-uncompressed.task";
import { UsecaseContainer } from "@chargement/usecase";

export type TaskContainer = {
	jobteaser: LoadJobteaserTask,
	"stagefr-compresse": LoadStagefrCompressedTask,
	"stagefr-decompresse": LoadStagefrUncompressedTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			jobteaser: new LoadJobteaserTask(usecases.chargerFluxJobteaser),
			"stagefr-compresse" : new LoadStagefrCompressedTask(usecases.chargerFluxStagefrCompresse),
			"stagefr-decompresse": new LoadStagefrUncompressedTask(usecases.chargerFluxStagefrDecompresse),
		};
	}
}
