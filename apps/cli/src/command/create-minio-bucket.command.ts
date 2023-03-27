import { Command, CommandRunner } from "nest-commander";

import {
	CreateContactCejMinioBucketSubCommand,
} from "@maintenance/src/infrastructure/sub-command/create-contact-cej-minio-bucket.sub-command";
import {
	CreateContactPoeMinioBucketSubCommand,
} from "@maintenance/src/infrastructure/sub-command/create-contact-poe-minio-bucket.sub-command";

@Command({
	name: "mkbucket",
	subCommands: [CreateContactCejMinioBucketSubCommand, CreateContactPoeMinioBucketSubCommand],
})
export class CreateMinioBucketCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
