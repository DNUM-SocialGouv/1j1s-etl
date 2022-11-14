import { Task } from "@shared/infrastructure/task/task";
import { TaskContainer as ExtractTasks } from "@stages/extraction/configuration/tasks.container";
import { TaskContainer as LoadTasks } from "@stages/chargement/configuration/tasks.container";
import { TaskContainer as TransformTasks } from "@stages/transformation/configuration/tasks.container";

export type TaskContainer = Record<string, Record<string, Record<string, Task>>>

export class TaskContainerFactory {
	public static create(tasks: {
		logements: Record<string, unknown>,
		stages: {
			extract: ExtractTasks;
			transform: TransformTasks;
			load: LoadTasks;
		}
	}): TaskContainer {
		return {
			stages: {
				extract: {
					jobteaser: tasks.stages.extract.jobteaser,
					"stagefr-compresse": tasks.stages.extract["stagefr-compresse"],
					"stagefr-decompresse": tasks.stages.extract["stagefr-decompresse"],
				},
				load: {
					jobteaser: tasks.stages.load.jobteaser,
					"stagefr-compresse": tasks.stages.load["stagefr-compresse"],
					"stagefr-decompresse": tasks.stages.load["stagefr-decompresse"],
				},
				transform: {
					jobteaser: tasks.stages.transform.jobteaser,
					"stagefr-compresse": tasks.stages.transform["stagefr-compresse"],
					"stagefr-decompresse": tasks.stages.transform["stagefr-decompresse"],
				},
			},
		};
	}
}
