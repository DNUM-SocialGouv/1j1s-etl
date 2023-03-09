import { Command, CommandRunner } from "nest-commander";

import { PurgeHousingAdsSubCommand } from "@cli/src/maintain/purge-housing-ads.sub-command";
import {
	PurgeInternshipsSubCommand,
} from "@cli/src/maintain/purge-internships.sub-command";

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
