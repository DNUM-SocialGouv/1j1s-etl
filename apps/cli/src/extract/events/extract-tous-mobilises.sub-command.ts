import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtractFlowTousMobilisesTask,
} from "@evenements/src/extraction/infrastructure/tasks/extract-flow-tous-mobilises.task";

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
