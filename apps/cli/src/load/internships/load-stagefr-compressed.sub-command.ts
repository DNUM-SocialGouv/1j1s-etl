import { CommandRunner, SubCommand } from "nest-commander";

import { LoadStagefrCompressedTask } from "@stages/src/chargement/infrastructure/tasks/load-stagefr-compressed.task";

@SubCommand({
	name: "stagefr-compresse",
})
export class LoadStagefrCompressedSubCommand extends CommandRunner {
	constructor(private readonly loadStagefrCompressed: LoadStagefrCompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.loadStagefrCompressed.run();
	}
}
