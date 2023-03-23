import { Command, CommandRunner } from "nest-commander";

import {
	SendContactCejToPoleEmploiSubCommand,
} from "@gestion-des-contacts/src/infrastructure/sub-command/send-contact-cej-to-pole-emploi.sub-command";
import {
	SendContactPoeToPoleEmploiSubCommand,
} from "@gestion-des-contacts/src/infrastructure/sub-command/send-contact-poe-to-pole-emploi.sub-command";

@Command({
	name: "send-contacts",
	subCommands: [SendContactCejToPoleEmploiSubCommand, SendContactPoeToPoleEmploiSubCommand],
})
export class SendContactsCommand extends CommandRunner {
	public override async run(): Promise<void> {
		return Promise.resolve();
	}
}
