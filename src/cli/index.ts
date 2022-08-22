import "dotenv/config";
import "module-alias/register";

import { ChargementModule } from "@chargement/infrastructure/tasks";
import { CliConfiguration } from "./cli.configuration";
import { ConfigurationFactory } from "@configuration/configuration";
import { TaskContainerFactory } from "./task.container";
import { TransformationModule } from "@transformation/infrastructure/tasks";

const configuration = ConfigurationFactory.create();

const transformTasks = TransformationModule.export();
const loadTasks = ChargementModule.export();

const tasks = TaskContainerFactory.create(configuration, { transform: transformTasks, load: loadTasks });
const { a: actionArg, f: flux } = CliConfiguration.create(configuration);

const action = tasks[actionArg];

if (action) {
	const task = action[flux];
	task.run();
}
