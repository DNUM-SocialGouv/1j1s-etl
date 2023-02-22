import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformFlowImmojeuneTask,
} from "@logements/src/transformation/infrastructure/tasks/transform-flow-immojeune.task";

@SubCommand({
	name: "immojeune",
})
export class TransformImmojeuneSubCommand extends CommandRunner {
	constructor(private readonly transformImmojeune: TransformFlowImmojeuneTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.transformImmojeune.run();
	}
}
