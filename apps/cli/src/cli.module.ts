import { Module } from "@nestjs/common";

import { ExtractCommand } from "@cli/src/extract/extract.command";
import { LoadCommand } from "@cli/src/load/load.command";
import { TransformCommand } from "@cli/src/transform/transform.command";
import { Evenements } from "@evenements/src";
import { ConfigurationFactory } from "@evenements/src/chargement/configuration/configuration";
import { Logements } from "@logements/src";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/src";
import { Stages } from "@stages/src";

@Module({
  imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.create] }), Evenements, Logements, SharedModule, Stages],
  providers: [
      ...ExtractCommand.registerWithSubCommands(),
      ...TransformCommand.registerWithSubCommands(),
      ...LoadCommand.registerWithSubCommands(),
  ],
})
export class CliModule {}
