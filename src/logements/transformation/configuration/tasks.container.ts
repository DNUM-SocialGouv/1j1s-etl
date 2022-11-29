import { Configuration } from "@logements/transformation/configuration/configuration";
import { UsecaseContainer } from "@logements/transformation/usecase";
import {
	TransformFluxImmojeuneTask,
} from "@logements/transformation/infrastructure/tasks/transform-flux-immojeune.task";

export type TaskContainer = {
	immojeune: TransformFluxImmojeuneTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			immojeune: new TransformFluxImmojeuneTask(usecases.transformerFluxImmojeune, configuration),
		};
	}
}
