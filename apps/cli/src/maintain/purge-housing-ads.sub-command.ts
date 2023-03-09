import { CommandRunner, SubCommand } from "nest-commander";

import { PurgeHousingAdsTask } from "@maintenance/src/infrastructure/task/purge-housing-ads.task";

@SubCommand({
	name: "purge-housing-ads",
})
export class PurgeHousingAdsSubCommand extends CommandRunner {
	constructor(private readonly purgeHousingAdsTask: PurgeHousingAdsTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.purgeHousingAdsTask.run();
	}
}
