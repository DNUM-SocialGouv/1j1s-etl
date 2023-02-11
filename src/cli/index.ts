import { CliFactory } from "@cli/cli";
import { CliConfiguration } from "@cli/cli.configuration";
import { ConfigurationFactory } from "@maintenance/configuration";

process.setMaxListeners(25);

const configuration = ConfigurationFactory.create();
const tasks = CliFactory.create();
const { domain, action, flow } = CliConfiguration.create(configuration);

const associatedTask = tasks[domain][action];

if (associatedTask) {
	const task = associatedTask[flow];
	task.run();
}
