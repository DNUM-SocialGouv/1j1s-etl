import { CommandRunner, SubCommand } from "nest-commander";

import { LoadJobteaserTask } from "@stages/src/chargement/infrastructure/tasks/load-jobteaser.task";

@SubCommand({
	name: "jobteaser",
})
export class LoadJobteaserSubCommand extends CommandRunner {
	constructor(private readonly loadJobteaser: LoadJobteaserTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.loadJobteaser.run();
	}
}
