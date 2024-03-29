import { Command, CommandRunner } from "nest-commander";

import {
	LoadFlowTousMobilisesSubCommand,
} from "@evenements/src/chargement/infrastructure/sub-command/load-flow-tous-mobilises.sub-command";

import {
	LoadFlowOnisepSubCommand,
} from "@formations-initiales/src/chargement/infrastructure/sub-command/load-flow-onisep.sub-command";

import { LoadFlowImmojeuneSubCommand } from "@logements/src/chargement/infrastructure/sub-command/load-flow-immojeune.sub-command";
import { LoadFlowStudapartSubCommand } from "@logements/src/chargement/infrastructure/sub-command/load-flow-studapart.sub-command";

import {
	LoadFlowHelloworkSubCommand,
} from "@stages/src/chargement/infrastructure/sub-command/load-flow-hellowork.sub-command";
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
		LoadFlowHelloworkSubCommand,
		LoadFlowJobteaserSubCommand,
		LoadFlowStagefrCompressedSubCommand,
		LoadFlowStagefrUncompressedSubCommand,
		LoadFlowOnisepSubCommand,
	],
})
export class LoadCommand extends CommandRunner {
	public async run(): Promise<void> {
		return Promise.resolve();
	}
}
