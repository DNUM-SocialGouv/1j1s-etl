import { Module } from "@nestjs/common";

import { ExtractCommand } from "@cli/src/extract/extract.command";
import { LoadCommand } from "@cli/src/load/load.command";
import { TransformCommand } from "@cli/src/transform/transform.command";

import { Evenements } from "@evenements/src";

import { Logements } from "@logements/src";

import { Shared } from "@shared/src";

import { Stages } from "@stages/src";

@Module({
  imports: [Evenements, Logements, Shared, Stages],
  providers: [
      ...ExtractCommand.registerWithSubCommands(),
      ...TransformCommand.registerWithSubCommands(),
      ...LoadCommand.registerWithSubCommands(),
  ],
})
export class CliModule {}
