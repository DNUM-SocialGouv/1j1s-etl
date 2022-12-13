import { Configuration } from "@logements/chargement/configuration/configuration";
import { LoadImmojeuneTask } from "@logements/chargement/infrastructure/tasks/load-immojeune.task";
import { UsecaseContainer } from "@logements/chargement/usecase";

export type TaskContainer = {
    immojeune: LoadImmojeuneTask
}

export class TaskContainerFactory {

    public static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
        return {
            immojeune: new LoadImmojeuneTask(usecases.immojeune, configuration),
        };
    }
}
