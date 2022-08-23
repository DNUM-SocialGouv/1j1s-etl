import { Configuration } from "@configuration/configuration";
import { Task } from "@shared/gateway/task";
import { TaskContainer as TransformTasks } from "@transformation/configuration/tasks.container"
import { TaskContainer as LoadTasks } from "@chargement/configuration/tasks.container"

export type TaskContainer = {
	[command: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	static create(configuration: Configuration, tasks: { transform: TransformTasks, load: LoadTasks }): TaskContainer {
		return {
			load: {
				jobteaser: tasks.load.jobteaser,
				"stagefr-compresse": tasks.load["stagefr-compresse"],
				"stagefr-decompresse": tasks.load["stagefr-decompresse"]
			},
			transform: {
				jobteaser: tasks.transform.jobteaser,
				"stagefr-compresse": tasks.transform["stagefr-compresse"],
				"stagefr-decompresse": tasks.transform["stagefr-decompresse"]
			},
		};
	}
}
