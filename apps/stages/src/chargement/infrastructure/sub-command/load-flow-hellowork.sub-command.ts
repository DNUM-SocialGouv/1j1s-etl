import { CommandRunner, SubCommand } from "nest-commander";

import { ChargerFluxHellowork } from "@stages/src/chargement/application-service/charger-flux-hellowork.usecase";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import { Configuration } from "@stages/src/chargement/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/chargement/infrastructure/configuration/log.decorator";

@SubCommand({ name: LoadFlowHelloworkSubCommand.FLOW_NAME })
export class LoadFlowHelloworkSubCommand extends CommandRunner {
  private static readonly FLOW_NAME = "hellowork";

  constructor(
    private readonly chargerHellowork: ChargerFluxHellowork,
    private readonly configuration: Configuration
  ) {
    super();
  }

  @CommandLog(LoadFlowHelloworkSubCommand.FLOW_NAME)
  public async run(): Promise<void> {
    await this.chargerHellowork.executer(
      new FluxChargement(this.configuration.HELLOWORK.NAME, this.configuration.HELLOWORK.TRANSFORMED_FILE_EXTENSION)
    );
  }
}
