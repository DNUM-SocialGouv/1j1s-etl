import { CommandRunner, SubCommand } from "nest-commander";

import { ChargerFluxOnisep } from "@formations-initiales/src/chargement/application-service/charger-flux-onisep.usecase";
import { FluxChargement } from "@formations-initiales/src/chargement/domain/model/flux";
import { Configuration } from "@formations-initiales/src/chargement/infrastructure/configuration/configuration";
import { CommandLog } from "@formations-initiales/src/chargement/infrastructure/configuration/log.decorator";

@SubCommand({ name: LoadFlowOnisepSubCommand.FLOW_NAME })
export class LoadFlowOnisepSubCommand extends CommandRunner {
  private static readonly FLOW_NAME = "onisep";

  constructor(
    private readonly chargerOnisep: ChargerFluxOnisep,
    private readonly configuration: Configuration
  ) {
    super();
  }

  @CommandLog(LoadFlowOnisepSubCommand.FLOW_NAME)
  public async run(): Promise<void> {
    await this.chargerOnisep.executer(
      new FluxChargement(this.configuration.ONISEP.NAME, this.configuration.ONISEP.TRANSFORMED_FILE_EXTENSION)
    );
  }
}
