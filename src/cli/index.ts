import "dotenv/config";
import "module-alias/register";

import { ChargementModule } from "@chargement/configuration";
import { CliConfiguration } from "./cli.configuration";
import { ConfigurationFactory } from "@configuration/configuration";
import { ExtractionModule } from "@extraction/configuration";
import { TaskContainerFactory } from "./task.container";
import { TransformationModule } from "@transformation/configuration";

process.setMaxListeners(18);

const configuration = ConfigurationFactory.create();

const extractTasks = ExtractionModule.export();
const transformTasks = TransformationModule.export();
const loadTasks = ChargementModule.export();

const tasks = TaskContainerFactory.create({ extract: extractTasks, transform: transformTasks, load: loadTasks });
const { a: actionArg, f: flux } = CliConfiguration.create(configuration);

const action = tasks[actionArg];

if (action) {
	const task = action[flux];
	task.run();
}
