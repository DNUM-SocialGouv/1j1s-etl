import { Module } from "@nestjs/common";

import { ExtractCommand } from "@cli/src/command/extract.command";
import { LoadCommand } from "@cli/src/command/load.command";
import { MaintainCommand } from "@cli/src/command/maintain.command";
import { SendContactsCommand } from "@cli/src/command/send-contacts.command";
import { TransformCommand } from "@cli/src/command/transform.command";

import { Evenements } from "@evenements/src";

import { FormationsInitiales } from "@formations-initiales/src";

import { GestionDesContacts } from "@gestion-des-contacts/src";

import { Logements } from "@logements/src";

import { Maintenance } from "@maintenance/src";

import { Stages } from "@stages/src";

@Module({
	imports: [Evenements, GestionDesContacts, Logements, Maintenance, Stages, FormationsInitiales],
	providers: [
		ExtractCommand,
		TransformCommand,
		LoadCommand,
		MaintainCommand,
		SendContactsCommand,
	],
})
export class CliModule {
}
