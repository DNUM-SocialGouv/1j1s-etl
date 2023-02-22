import { CommandFactory } from "nest-commander";

import { CliModule } from "@cli/src/cli.module";

async function bootstrap(): Promise<void> {
  await CommandFactory.run(CliModule, ["error"]);
}

bootstrap().catch((e) => console.error(e));
