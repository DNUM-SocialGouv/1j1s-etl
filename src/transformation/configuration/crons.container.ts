import { Configuration } from "@configuration/configuration";
import { Cron } from "@transformation/infrastructure/cron/cron";
import { HelloWorldCron } from "@transformation/infrastructure/cron/hello-world.cron";
import { LoggerFactory } from "@transformation/configuration/logger";

export type CronContainer = {
	[transform: string]: { [key: string]: Cron }
}

export class CronContainerFactory {
	static create(configuration: Configuration): CronContainer {
		const helloWorldLogger = LoggerFactory.create(configuration);

		return {
			transform: {
				hello: new HelloWorldCron(helloWorldLogger),
			},
		};
	}
}
