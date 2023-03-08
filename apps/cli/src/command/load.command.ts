import { Command, CommandRunner } from "nest-commander";

import {
	LoadFlowTousMobilisesSubCommand,
} from "@evenements/src/chargement/infrastructure/sub-command/load-flow-tous-mobilises.sub-command";

import { LoadFlowImmojeuneSubCommand } from "@logements/src/chargement/infrastructure/sub-command/load-flow-immojeune.sub-command";
import { LoadFlowStudapartSubCommand } from "@logements/src/chargement/infrastructure/sub-command/load-flow-studapart.sub-command";

import { LoadFlowJobteaserSubCommand } from "@stages/src/chargement/infrastructure/sub-command/load-flow-jobteaser.sub-command";
import {
	LoadFlowStagefrCompressedSubCommand,
} from "@stages/src/chargement/infrastructure/sub-command/load-flow-stagefr-compressed.sub-command";
import {
	LoadFlowStagefrUncompressedSubCommand,
} from "@stages/src/chargement/infrastructure/sub-command/load-flow-stagefr-uncompressed.sub-command";

@Command({
	name: "load",
	subCommands: [
		LoadFlowTousMobilisesSubCommand,
		LoadFlowImmojeuneSubCommand,
		LoadFlowStudapartSubCommand,
		LoadFlowJobteaserSubCommand,
		LoadFlowStagefrCompressedSubCommand,
		LoadFlowStagefrUncompressedSubCommand,
	],
})
export class LoadCommand extends CommandRunner {
	public async run(): Promise<void> {
		return Promise.resolve();
	}
}
