import { Configuration } from "@configuration/configuration";
import { Task } from "@shared/gateway/task";
import { UsecaseContainer } from "@chargement/usecase";

export type TaskContainer = {
	[load: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		return {
			load: {
			},
		};
	}
}
