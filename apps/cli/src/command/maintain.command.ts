import { Command, CommandRunner } from "nest-commander";

import { PurgeHousingAdsSubCommand } from "@maintenance/src/infrastructure/sub-command/purge-housing-ads.sub-command";
import {
	PurgeInternshipsSubCommand,
} from "@maintenance/src/infrastructure/sub-command/purge-internships.sub-command";

@Command({
	name: "maintain",
	subCommands: [
		PurgeInternshipsSubCommand,
		PurgeHousingAdsSubCommand,
	],
})
export class MaintainCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
