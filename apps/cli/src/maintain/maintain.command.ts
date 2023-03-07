import { Command, CommandRunner } from "nest-commander";

import {
	PurgeInternshipsSubCommand,
} from "@maintenance/src/infrastructure/sub-command/purge-internships.sub-command";

@Command({
	name: "maintain",
	subCommands: [
		PurgeInternshipsSubCommand,
	],
})
export class MaintainCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
