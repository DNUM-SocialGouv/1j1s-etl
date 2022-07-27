import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { CronContainerFactory } from "@transformation/configuration/crons.container";
import { YargsConfiguration } from "@transformation/configuration/yargs.configuration";

const configuration = ConfigurationFactory.create();
const crons = CronContainerFactory.create(configuration);
const { a: actionArg, f: flux } = YargsConfiguration.create();

const action = crons[actionArg];

if (action) {
	const cron = action[flux];
	if (cron) {
		cron.init();
	}
}
