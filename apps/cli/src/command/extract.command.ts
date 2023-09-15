import { Command, CommandRunner } from "nest-commander";

import {
	ExtractFlowTousMobilisesSubCommand,
} from "@evenements/src/extraction/infrastructure/sub-command/extract-flow-tous-mobilises.sub-command";

import {
	ExtractFlowOnisepSubCommand,
} from "@formations-initiales/src/extraction/infrastructure/sub-command/extract-flow-onisep.sub-command";

import {
	ExtractFlowImmojeuneSubCommand,
} from "@logements/src/extraction/infrastructure/sub-command/extract-flow-immojeune.sub-command";
import {
	ExtractFlowStudapartSubCommand,
} from "@logements/src/extraction/infrastructure/sub-command/extract-flow-studapart.sub-command";

import {
	ExtractFlowHelloworkSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-hellowork.sub-command";
import {
	ExtractFlowJobteaserSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-jobteaser.sub-command";
import {
	ExtractFlowStagefrCompressedSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-stagefr-compressed.sub-command";
import {
	ExtractFlowStagefrUncompressedSubCommand,
} from "@stages/src/extraction/infrastructure/sub-command/extract-flow-stagefr-uncompressed.sub-command";

@Command({
	name: "extract",
	subCommands: [
		ExtractFlowOnisepSubCommand,
		ExtractFlowTousMobilisesSubCommand,
		ExtractFlowImmojeuneSubCommand,
		ExtractFlowStudapartSubCommand,
		ExtractFlowHelloworkSubCommand,
		ExtractFlowJobteaserSubCommand,
		ExtractFlowStagefrCompressedSubCommand,
		ExtractFlowStagefrUncompressedSubCommand,
	],
})
export class ExtractCommand extends CommandRunner {
	public async run(): Promise<void> {
		return Promise.resolve();
	}
}
