import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtractFlowStagefrUncompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flow-stagefr-uncompressed.task";

@SubCommand({
	name: "stagefr-decompresse",
})
export class ExtractStagefrUncompressedSubCommand extends CommandRunner {
	constructor(private readonly extractStagefrUncompressed: ExtractFlowStagefrUncompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.extractStagefrUncompressed.run();
	}
}
