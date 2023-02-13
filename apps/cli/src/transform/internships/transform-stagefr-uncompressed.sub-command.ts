import {
	TransformFlowStagefrUncompressedTask,
} from "@stages/src/transformation/infrastructure/tasks/transform-flow-stagefr-uncompressed.task";
import { CommandRunner, SubCommand } from "nest-commander";

@SubCommand({
	name: "stagefr-decompresse",
})
export class TransformStagefrUncompressedSubCommand extends CommandRunner {
	constructor(private readonly transformStagefrUncompressed: TransformFlowStagefrUncompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.transformStagefrUncompressed.run();
	}
}
