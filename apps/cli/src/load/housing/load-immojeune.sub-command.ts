import { LoadImmojeuneTask } from "@logements/src/chargement/infrastructure/tasks/load-immojeune.task";
import { CommandRunner, SubCommand } from "nest-commander";

@SubCommand({
	name: "immojeune",
})
export class LoadImmojeuneSubCommand extends CommandRunner {
	constructor(private readonly loadImmojeune: LoadImmojeuneTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.loadImmojeune.run();
	}
}
