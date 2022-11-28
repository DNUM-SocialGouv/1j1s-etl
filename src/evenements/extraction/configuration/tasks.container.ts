import { Configuration } from "@evenements/extraction/configuration/configuration";
import {
	ExtractFluxEvenementTousMobilisesTask,
} from "@evenements/extraction/infrastucture/tasks/extract-flux-evement-tous-mobilites.task";
import { UsecaseContainer } from "@evenements/extraction/usecase";

export type TaskContainer = {
	"tous-mobilises": ExtractFluxEvenementTousMobilisesTask
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			"tous-mobilises": new ExtractFluxEvenementTousMobilisesTask(usecases.extraireEvenementsTousMobilises, configuration),
		};
	}
}
