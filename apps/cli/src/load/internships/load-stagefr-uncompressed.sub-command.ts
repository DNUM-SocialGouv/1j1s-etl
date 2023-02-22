import { CommandRunner, SubCommand } from "nest-commander";

import {
	LoadStagefrUncompressedTask,
} from "@stages/src/chargement/infrastructure/tasks/load-stagefr-uncompressed.task";

@SubCommand({
	name: "stagefr-decompresse",
})
export class LoadStagefrUncompressedSubCommand extends CommandRunner {
	constructor(private readonly loadStagefrUncompressed: LoadStagefrUncompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.loadStagefrUncompressed.run();
	}
}
