import { CronJob } from "cron";

import { Cron } from "@transformation/infrastructure/cron/cron";
import { Logger } from "@shared/configuration/logger";

export class HelloWorldCron implements Cron {
	constructor(private readonly logger: Logger) {
	}

	init(): CronJob {
		return new CronJob({
			cronTime: "0 */1 * * *",
			onTick: (): void => this.logger.info("Hello World !"),
			runOnInit: true,
			start: true,
			timeZone: "Europe/Paris",
		});
	}
}
