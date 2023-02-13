import { LoadTousMobilisesSubCommand } from "@cli/src/load/events/load-tous-mobilises.sub-command";
import { LoadImmojeuneSubCommand } from "@cli/src/load/housing/load-immojeune.sub-command";
import { LoadStudapartSubCommand } from "@cli/src/load/housing/load-studapart.sub-command";
import { LoadJobteaserSubCommand } from "@cli/src/load/internships/load-jobteaser.sub-command";
import { LoadStagefrCompressedSubCommand } from "@cli/src/load/internships/load-stagefr-compressed.sub-command";
import { LoadStagefrUncompressedSubCommand } from "@cli/src/load/internships/load-stagefr-uncompressed.sub-command";
import { Command, CommandRunner } from "nest-commander";

@Command({
	name: "load",
	subCommands: [
		LoadTousMobilisesSubCommand,
		LoadImmojeuneSubCommand,
		LoadStudapartSubCommand,
		LoadJobteaserSubCommand,
		LoadStagefrCompressedSubCommand,
		LoadStagefrUncompressedSubCommand,
	],
})
export class LoadCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
