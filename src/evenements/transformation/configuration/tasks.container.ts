import { Configuration } from "@evenements/transformation/configuration/configuration";
import {
	TransformFlowJobteaserTask,
} from "@evenements/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";
import { UseCaseContainer } from "@evenements/transformation/usecase";

export type TaskContainer = {
	"tous-mobilises": TransformFlowJobteaserTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, useCaseContainer: UseCaseContainer): TaskContainer {
		return {
			"tous-mobilises": new TransformFlowJobteaserTask(useCaseContainer.transformerFluxTousMobilisesUsecase, configuration),
		};
	}
}
