import { ExtractFluxImmojeuneTask } from "@logements/extraction/infrastructure/tasks/extract-flux-immojeune.task";
import { Configuration } from "@logements/extraction/configuration/configuration";
import { UsecaseContainer } from "@logements/extraction/usecase";

export type TaskContainer = {
	immojeune: ExtractFluxImmojeuneTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			immojeune: new ExtractFluxImmojeuneTask(usecases.extraireImmojeune, configuration),
		};
	}
}
