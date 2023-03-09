import { CommandRunner, SubCommand } from "nest-commander";

import { PurgeInternshipsTask } from "@maintenance/src/infrastructure/task/purge-internships.task";

@SubCommand({
	name: "purge-internships",
})
export class PurgeInternshipsSubCommand extends CommandRunner {
	constructor(private readonly purgeInternshipsTask: PurgeInternshipsTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.purgeInternshipsTask.run();
	}
}
