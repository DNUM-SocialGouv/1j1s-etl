import { Command, CommandRunner } from "nest-commander";

import {
	SendContactCejToPoleEmploiSubCommand,
} from "@gestion-des-contacts/src/infrastructure/sub-command/send-contact-cej-to-pole-emploi.sub-command";

@Command({
	name: "send-contacts",
	subCommands: [SendContactCejToPoleEmploiSubCommand],
})
export class SendContactsCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
