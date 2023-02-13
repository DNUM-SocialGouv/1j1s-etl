import { LoadStudapartTask } from "@logements/src/chargement/infrastructure/tasks/load-studapart.task";
import { CommandRunner, SubCommand } from "nest-commander";

@SubCommand({
	name: "studapart",
})
export class LoadStudapartSubCommand extends CommandRunner {
	constructor(private readonly loadStudapart: LoadStudapartTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.loadStudapart.run();
	}
}
