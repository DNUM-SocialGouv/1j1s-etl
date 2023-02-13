import {
	ExtractFlowTousMobilisesTask,
} from "@evenements/src/extraction/infrastructure/tasks/extract-flow-tous-mobilises.task";
import { CommandRunner, SubCommand } from "nest-commander";

@SubCommand({
	name: "tous-mobilises",
})
export class ExtractTousMobilisesSubCommand extends CommandRunner {
	constructor(private readonly extractTousMobilises: ExtractFlowTousMobilisesTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.extractTousMobilises.run();
	}
}
