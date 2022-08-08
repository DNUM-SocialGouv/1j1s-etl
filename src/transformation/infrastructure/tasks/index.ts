import "dotenv/config";
import "module-alias/register";

import { ConfigurationFactory } from "@configuration/configuration";
import { GatewayContainerFactory } from "@transformation/configuration/gateways.container";
import { TaskContainerFactory } from "@transformation/configuration/tasks.container";
import { UsecaseContainerFactory } from "@transformation/configuration/usecases.container";
import { YargsConfiguration } from "@transformation/configuration/yargs.configuration";

const configuration = ConfigurationFactory.create();
const gateways = GatewayContainerFactory.create(configuration);
const usecases = UsecaseContainerFactory.create(gateways);
const tasks = TaskContainerFactory.create(configuration, usecases);
const { a: actionArg, f: flux } = YargsConfiguration.create(configuration);

const action = tasks[actionArg];

if (action) {
	const task = action[flux];
	task.run();
}
