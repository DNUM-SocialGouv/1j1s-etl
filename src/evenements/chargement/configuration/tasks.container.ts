import { Configuration } from "@evenements/chargement/configuration/configuration";
import { ChargementUseCaseContainer } from "@evenements/chargement/usecase";
import { LoadTousMobilisesTask } from "@evenements/chargement/infrastructure/tasks/load-tous-mobilises.task";

export type TaskContainer = {
	"tous-mobilises": LoadTousMobilisesTask,
}

export class TaskContainerFactory {
	public static create(configuration: Configuration, usecases: ChargementUseCaseContainer): TaskContainer {
		return {
			"tous-mobilises" : new LoadTousMobilisesTask(usecases.chargerFluxTousMobilisesUseCase, configuration),
		};
	}
}
