import { Configuration } from "@logements/transformation/configuration/configuration";
import { UsecaseContainer } from "@logements/transformation/usecase";
import { TransformFluxStudapartTask } from "@logements/transformation/infrastructure/tasks/transform-flux-studapart.task";
import { TransformFluxImmojeuneTask } from "@logements/transformation/infrastructure/tasks/transform-flux-immojeune.task";

export type TaskContainer = {
	immojeune: TransformFluxImmojeuneTask
	studapart: TransformFluxStudapartTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, useCases: UsecaseContainer): TaskContainer {
		return {
			immojeune: new TransformFluxImmojeuneTask(useCases.transformerFluxImmojeune, configuration),
			studapart: new TransformFluxStudapartTask(useCases.transformerFluxStudapart, configuration),
		};
	}
}
