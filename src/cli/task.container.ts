import { Task } from "@shared/infrastructure/task/task";
import { TaskContainer as ExtractTasks } from "@stages/extraction/configuration/tasks.container";
import { TaskContainer as LoadTasks } from "@stages/chargement/configuration/tasks.container";
import { TaskContainer as TransformTasks } from "@stages/transformation/configuration/tasks.container";

export type TaskContainer = Record<string, Record<string, Record<string, Task>>>

export class TaskContainerFactory {
	public static create(tasks: {
		events: Record<string, unknown>,
		housing: Record<string, unknown>,
		internships: {
			extract: ExtractTasks;
			transform: TransformTasks;
			load: LoadTasks;
		}
	}): TaskContainer {
		return {
			internships: {
				extract: {
					jobteaser: tasks.internships.extract.jobteaser,
					"stagefr-compresse": tasks.internships.extract["stagefr-compresse"],
					"stagefr-decompresse": tasks.internships.extract["stagefr-decompresse"],
				},
				load: {
					jobteaser: tasks.internships.load.jobteaser,
					"stagefr-compresse": tasks.internships.load["stagefr-compresse"],
					"stagefr-decompresse": tasks.internships.load["stagefr-decompresse"],
				},
				transform: {
					jobteaser: tasks.internships.transform.jobteaser,
					"stagefr-compresse": tasks.internships.transform["stagefr-compresse"],
					"stagefr-decompresse": tasks.internships.transform["stagefr-decompresse"],
				},
			},
		};
	}
}
