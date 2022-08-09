import { Configuration } from "@configuration/configuration";
import { LoggerFactory } from "@shared/logger.factory";
import { Task } from "@shared/gateway/task";
import { TransformFluxJobteaserTask } from "@transformation/infrastructure/tasks/transform-flux-jobteaser.task";
import { UsecaseContainer } from "@transformation/usecase";

export type TaskContainer = {
	[transform: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);

		return {
			transform: {
				jobteaser: new TransformFluxJobteaserTask(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
			},
		};
	}
}
