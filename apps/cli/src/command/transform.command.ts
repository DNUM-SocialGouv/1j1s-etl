import { Command, CommandRunner } from "nest-commander";

import { TransformFlowTousMobilisesSubCommand } from "@evenements/src/transformation/infrastructure/sub-command/transform-flow-tous-mobilises.sub-command";

import { TransformFlowImmojeuneSubCommand } from "@logements/src/transformation/infrastructure/sub-command/transform-flow-immojeune.sub-command";
import { TransformFlowStudapartSubCommand } from "@logements/src/transformation/infrastructure/sub-command/transform-flow-studapart.sub-command";

import { TransformFlowJobteaserSubCommand } from "@stages/src/transformation/infrastructure/sub-command/transform-flow-jobteaser.sub-command";
import { TransformFlowStagefrCompressedSubCommand } from "@stages/src/transformation/infrastructure/sub-command/transform-flow-stagefr-compressed.sub-command";
import { TransformFlowStagefrUncompressedSubCommand } from "@stages/src/transformation/infrastructure/sub-command/transform-flow-stagefr-uncompressed.sub-command";

@Command({
	name: "transform",
	subCommands: [
		TransformFlowTousMobilisesSubCommand,
		TransformFlowImmojeuneSubCommand,
		TransformFlowStudapartSubCommand,
		TransformFlowJobteaserSubCommand,
		TransformFlowStagefrCompressedSubCommand,
		TransformFlowStagefrUncompressedSubCommand,
	],
})
export class TransformCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
