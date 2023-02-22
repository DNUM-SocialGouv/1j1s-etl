import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtractFluxStagefrCompressedTask,
} from "@stages/src/extraction/infrastructure/tasks/extract-flux-stagefr-compressed.task";

@SubCommand({
	name: "stagefr-compresse",
})
export class ExtractStagefrCompresseSubCommand extends CommandRunner {
	constructor(private readonly extractStagefrCompresse: ExtractFluxStagefrCompressedTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.extractStagefrCompresse.run();
	}
}
