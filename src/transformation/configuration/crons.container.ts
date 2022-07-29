import { Configuration } from "@configuration/configuration";
import { Cron } from "@transformation/infrastructure/cron/cron";
import { LoggerFactory } from "@transformation/configuration/logger";
import { TransformFluxJobteaserCron } from "@transformation/infrastructure/cron/transform-flux-jobteaser.cron";
import { UsecaseContainer } from "@transformation/usecase";

export type CronContainer = {
	[transform: string]: { [key: string]: Cron }
}

export class CronContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): CronContainer {
		const jobteaserLogger = LoggerFactory.create(configuration.JOBTEASER);

		return {
			transform: {
				jobteaser: new TransformFluxJobteaserCron(configuration, usecases.transformerFluxJobteaser, jobteaserLogger),
			},
		};
	}
}
