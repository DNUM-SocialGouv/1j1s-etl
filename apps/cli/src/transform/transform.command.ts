import { Command, CommandRunner } from "nest-commander";

import { TransformTousMobilisesSubCommand } from "@cli/src/transform/events/transform-tous-mobilises.sub-command";
import { TransformImmojeuneSubCommand } from "@cli/src/transform/housing/transform-immojeune.sub-command";
import { TransformStudapartSubCommand } from "@cli/src/transform/housing/transform-studapart.sub-command";
import { TransformJobteaserSubCommand } from "@cli/src/transform/internships/transform-jobteaser.sub-command";
import {
	TransformStagefrCompressedSubCommand,
} from "@cli/src/transform/internships/transform-stagefr-compressed.sub-command";
import {
	TransformStagefrUncompressedSubCommand,
} from "@cli/src/transform/internships/transform-stagefr-uncompressed.sub-command";

@Command({
	name: "transform",
	subCommands: [
		TransformTousMobilisesSubCommand,
		TransformImmojeuneSubCommand,
		TransformStudapartSubCommand,
		TransformJobteaserSubCommand,
		TransformStagefrCompressedSubCommand,
		TransformStagefrUncompressedSubCommand,
	],
})
export class TransformCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
