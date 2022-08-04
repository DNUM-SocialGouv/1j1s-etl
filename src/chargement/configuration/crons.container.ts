import { Configuration } from "@configuration/configuration";
import { Cron } from "@shared/gateway/cron";
import { UsecaseContainer } from "@chargement/usecase";

export type CronContainer = {
	[transform: string]: { [key: string]: Cron }
}

export class CronContainerFactory {
	static create(configuration: Configuration, usecases: UsecaseContainer): CronContainer {
		return {
			transform: {
			},
		};
	}
}
