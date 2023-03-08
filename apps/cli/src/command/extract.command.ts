import { Command, CommandRunner } from "nest-commander";

import { ExtractFlowTousMobilisesSubCommand } from "@evenements/src/extraction/infrastructure/sub-command/extract-flow-tous-mobilises.sub-command";

import {
	ExtractFlowImmojeuneSubCommand,
} from "@logements/src/extraction/infrastructure/sub-command/extract-flow-immojeune.sub-command";
import {
	ExtractFlowStudapartSubCommand,
} from "@logements/src/extraction/infrastructure/sub-command/extract-flow-studapart.sub-command";

import { ExtractFlowJobteaserSubCommand } from "@stages/src/extraction/infrastructure/sub-command/extract-flow-jobteaser.sub-command";
import {
	ExtractFlowStagefrCompressedSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-stagefr-compressed.sub-command";
import { ExtractFlowStagefrUncompressedSubCommand } from "@stages/src/extraction/infrastructure/sub-command/extract-flow-stagefr-uncompressed.sub-command";

@Command({
	name: "extract",
	description: "Command to run something",
	subCommands: [
		ExtractFlowTousMobilisesSubCommand,
		ExtractFlowImmojeuneSubCommand,
		ExtractFlowStudapartSubCommand,
		ExtractFlowJobteaserSubCommand,
		ExtractFlowStagefrCompressedSubCommand,
		ExtractFlowStagefrUncompressedSubCommand,
	],
})
export class ExtractCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
