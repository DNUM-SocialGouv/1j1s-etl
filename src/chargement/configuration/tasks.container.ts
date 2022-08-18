import { Configuration } from "@configuration/configuration";
import { LoadJobteaserTask } from "@chargement/infrastructure/tasks/load-jobteaser.task";
import { LoggerFactory } from "@shared/logger.factory";
import { Task } from "@shared/gateway/task";
import { UsecaseContainer } from "@chargement/usecase";
import { LoadStagefrUncompressedTask } from "@chargement/infrastructure/tasks/load-stagefr-uncompressed.task";

export type TaskContainer = {
	[load: string]: { [key: string]: Task }
}

export class TaskContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): TaskContainer {
		const loadJobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);
		const loadStagefrUncompressedLogger = LoggerFactory.create(configuration.STAGEFR_UNCOMPRESSED);

		return {
			load: {
				jobteaser: new LoadJobteaserTask(usecases.chargerFluxJobteaser, loadJobteaserLogger),
				"stagefr-uncompressed": new LoadStagefrUncompressedTask(
					usecases.chargerFluxStagefrDecompresse,
					loadStagefrUncompressedLogger
				),
			},
		};
	}
}
