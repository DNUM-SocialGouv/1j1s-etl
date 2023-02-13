import {
	TransformFlowStagefrCompressedTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-stagefr-compressed.task";
import { CommandRunner, SubCommand } from "nest-commander";

@SubCommand({
	name: "stagefr-compresse",
})
export class TransformStagefrCompressedSubCommand extends CommandRunner {
	constructor(private readonly transformStagefrCompressed: TransformFlowStagefrCompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.transformStagefrCompressed.run();
	}
}
