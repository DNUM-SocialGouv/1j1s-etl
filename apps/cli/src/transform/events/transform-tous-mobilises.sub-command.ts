import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformFlowTousMobilisesTask,
} from "@evenements/src/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";

@SubCommand({
	name: "tous-mobilises",
})
export class TransformTousMobilisesSubCommand extends CommandRunner {
	constructor(private readonly transformTousMobilises: TransformFlowTousMobilisesTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.transformTousMobilises.run();
	}
}
