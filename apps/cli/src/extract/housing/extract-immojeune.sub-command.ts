import { CommandRunner, SubCommand } from "nest-commander";

import { ExtractFlowImmojeuneTask } from "@logements/src/extraction/infrastructure/tasks/extract-flow-immojeune.task";

@SubCommand({
	name: "immojeune",
})
export class ExtractImmojeuneSubCommand extends CommandRunner {
	constructor(private readonly extractImmojeune: ExtractFlowImmojeuneTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.extractImmojeune.run();
	}
}
