import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtractFlowStagefrCompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flow-stagefr-compressed.task";

@SubCommand({
	name: "stagefr-compresse",
})
export class ExtractStagefrCompresseSubCommand extends CommandRunner {
	constructor(private readonly extractStagefrCompresse: ExtractFlowStagefrCompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.extractStagefrCompresse.run();
	}
}
