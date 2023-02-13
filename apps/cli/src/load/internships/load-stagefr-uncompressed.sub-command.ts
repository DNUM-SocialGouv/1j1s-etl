import {
	LoadStagefrUncompressedTask,
} from "@stages/src/chargement/infrastructure/tasks/load-stagefr-uncompressed.task";
import { CommandRunner, SubCommand } from "nest-commander";

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
