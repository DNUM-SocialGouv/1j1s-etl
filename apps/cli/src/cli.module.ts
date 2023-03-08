import { Module } from "@nestjs/common";

import { ExtractCommand } from "@cli/src/command/extract.command";
import { LoadCommand } from "@cli/src/command/load.command";
import { MaintainCommand } from "@cli/src/maintain/maintain.command";
import { TransformCommand } from "@cli/src/command/transform.command";

import { Evenements } from "@evenements/src";

import { Logements } from "@logements/src";

import { Maintenance } from "@maintenance/src";

import { Stages } from "@stages/src";

@Module({
	imports: [Evenements, Logements, Stages, Maintenance],
	providers: [
		...ExtractCommand.registerWithSubCommands(),
		...TransformCommand.registerWithSubCommands(),
		...LoadCommand.registerWithSubCommands(),
		...MaintainCommand.registerWithSubCommands(),
	],
})
export class CliModule {
}
