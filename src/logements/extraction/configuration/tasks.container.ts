import { ExtractFluxImmojeuneTask } from "@logements/extraction/infrastructure/tasks/extract-flux-immojeune.task";
import { Configuration } from "@logements/extraction/configuration/configuration";
import { UsecaseContainer } from "@logements/extraction/usecase";
import { ExtractFluxStudapartTask } from "@logements/extraction/infrastructure/tasks/extract-flux-studapart.task";

export type TaskContainer = {
	immojeune: ExtractFluxImmojeuneTask
	studapart: ExtractFluxStudapartTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			immojeune: new ExtractFluxImmojeuneTask(usecases.extraireImmojeune, configuration),
			studapart: new ExtractFluxStudapartTask(usecases.extraireStudapart, configuration),
		};
	}
}
