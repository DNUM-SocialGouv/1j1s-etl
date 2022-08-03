import { Configuration } from "@configuration/configuration";
import { Task } from "@transformation/infrastructure/tasks/task";
import { LoggerFactory } from "@transformation/configuration/logger";
import { TransformFluxJobteaserTask } from "@transformation/infrastructure/tasks/transform-flux-jobteaser.task";
import { UsecaseContainer } from "@transformation/usecase";

export type CronContainer = {
	[transform: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): CronContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);

		return {
			transform: {
				jobteaser: new TransformFluxJobteaserTask(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
			},
		};
	}
}
