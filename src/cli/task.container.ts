import { Task } from "@shared/infrastructure/task/task";
import { TaskContainer as ExtractTasks } from "@extraction/configuration/tasks.container";
import { TaskContainer as LoadTasks } from "@chargement/configuration/tasks.container";
import { TaskContainer as TransformTasks } from "@transformation/configuration/tasks.container";

export type TaskContainer = {
	[command: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	public static create(tasks: { extract: ExtractTasks; transform: TransformTasks; load: LoadTasks }): TaskContainer {
		return {
			extract: {
				jobteaser: tasks.extract.jobteaser,
				"stagefr-compresse": tasks.extract["stagefr-compresse"],
				"stagefr-decompresse": tasks.extract["stagefr-decompresse"],
			},
			load: {
				jobteaser: tasks.load.jobteaser,
				"stagefr-compresse": tasks.load["stagefr-compresse"],
				"stagefr-decompresse": tasks.load["stagefr-decompresse"],
			},
			transform: {
				jobteaser: tasks.transform.jobteaser,
				"stagefr-compresse": tasks.transform["stagefr-compresse"],
				"stagefr-decompresse": tasks.transform["stagefr-decompresse"],
			},
		};
	}
}
