import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformFlowJobteaserTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-jobteaser.task";

@SubCommand({
	name: "jobteaser",
})
export class TransformJobteaserSubCommand extends CommandRunner {
	constructor(private readonly transformJobteaser: TransformFlowJobteaserTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.transformJobteaser.run();
	}
}
