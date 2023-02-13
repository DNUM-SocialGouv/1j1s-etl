import { LoadTousMobilisesTask } from "@evenements/src/chargement/infrastructure/tasks/load-tous-mobilises.task";
import { CommandRunner, SubCommand } from "nest-commander";

@SubCommand({
	name: "tous-mobilises",
})
export class LoadTousMobilisesSubCommand extends CommandRunner {
	constructor(private readonly loadTousMobilises: LoadTousMobilisesTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.loadTousMobilises.run();
	}
}
