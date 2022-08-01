import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { CronContainerFactory } from "@transformation/configuration/crons.container";
import { YargsConfiguration } from "@transformation/configuration/yargs.configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { UsecaseContainerFactory } from "@transformation/configuration/usecases.container";

const configuration = ConfigurationFactory.create();
const gateways = GatewayContainerFactory.create(configuration);
const usecases = UsecaseContainerFactory.create(gateways);
const crons = CronContainerFactory.create(configuration, usecases);
const { a: actionArg, f: flux } = YargsConfiguration.create();

const action = crons[actionArg];

console.log("Coucouuuuu");

if (action) {
	const cron = action[flux];
	console.log(cron);
	if (cron) {
		cron.init();
	}
}
