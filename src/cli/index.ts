import "dotenv/config";
import "module-alias/register";

import { CliConfiguration } from "@cli/cli.configuration";
import { ConfigurationFactory } from "@configuration/configuration";
import { Evenements } from "@evenements/index";
import { Logements } from "@logements/index";
import { Stages } from "@stages/index";
import { TaskContainerFactory } from "@cli/task.container";

process.setMaxListeners(25);

const configuration = ConfigurationFactory.create();

const evenementsTasks = {
	extract: Evenements.ExtractionModule.export(),
	transform: Evenements.TransformationModule.export(),
};
const logementsTasks = {
	extract: Logements.ExtractionModule.export(),
};
const stagesTasks = {
	extract: Stages.ExtractionModule.export(),
	transform: Stages.TransformationModule.export(),
	load: Stages.ChargementModule.export(),
};

const tasks = TaskContainerFactory.create({ events: evenementsTasks, housing: logementsTasks, internships: stagesTasks });
const { domain, action, flow } = CliConfiguration.create(configuration);


const associatedTask = tasks[domain][action];

if (associatedTask) {
	const task = associatedTask[flow];
	task.run();
}
