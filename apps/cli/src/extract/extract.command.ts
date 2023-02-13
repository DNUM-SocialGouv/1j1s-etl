import { ExtractTousMobilisesSubCommand } from "@cli/src/extract/events/extract-tous-mobilises.sub-command";
import { ExtractImmojeuneSubCommand } from "@cli/src/extract/housing/extract-immojeune.sub-command";
import { ExtractStudapartSubCommand } from "@cli/src/extract/housing/extract-studapart.sub-command";
import { ExtractJobteaserSubCommand } from "@cli/src/extract/internships/extract-jobteaser.sub-command";
import { ExtractStagefrCompresseSubCommand } from "@cli/src/extract/internships/extract-stagefr-compresse.sub-command";
import {
	ExtractStagefrUncompressedSubCommand,
} from "@cli/src/extract/internships/extract-stagefr-uncompressed.sub-command";
import { Command, CommandRunner } from "nest-commander";

@Command({
	name: "extract",
	description: "Command to run something",
	subCommands: [
		ExtractTousMobilisesSubCommand,
		ExtractImmojeuneSubCommand,
		ExtractStudapartSubCommand,
		ExtractJobteaserSubCommand,
		ExtractStagefrCompresseSubCommand,
		ExtractStagefrUncompressedSubCommand,
	],
})
export class ExtractCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
