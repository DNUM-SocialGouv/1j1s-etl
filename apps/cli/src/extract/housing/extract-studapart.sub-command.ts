import { CommandRunner, SubCommand } from "nest-commander";

import { ExtractFlowStudapartTask } from "@logements/src/extraction/infrastructure/tasks/extract-flow-studapart.task";

@SubCommand({
	name: "studapart",
})
export class ExtractStudapartSubCommand extends CommandRunner {
	constructor(private readonly extractStudapart: ExtractFlowStudapartTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.extractStudapart.run();
	}
}
