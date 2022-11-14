import "dotenv/config";
import "module-alias/register";

import { CliConfiguration } from "@cli/cli.configuration";
import { ConfigurationFactory } from "@configuration/configuration";
import { Stages } from "@stages/index";
import { TaskContainerFactory } from "@cli/task.container";

process.setMaxListeners(18);

const configuration = ConfigurationFactory.create();

const logementsTasks = {};
const stagesTasks = {
	extract: Stages.ExtractionModule.export(),
	transform: Stages.TransformationModule.export(),
	load: Stages.ChargementModule.export(),
};

const tasks = TaskContainerFactory.create({ logements: logementsTasks, stages: stagesTasks });
const { domain, action, flux } = CliConfiguration.create(configuration);

const associatedTask = tasks[domain][action];

if (associatedTask) {
	const task = associatedTask[flux];
	task.run();
}
