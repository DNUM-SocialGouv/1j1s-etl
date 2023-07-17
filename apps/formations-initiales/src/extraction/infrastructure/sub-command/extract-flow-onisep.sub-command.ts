import { CommandRunner, SubCommand } from "nest-commander";

import {
  ExtraireFluxFormationsInitialesOnisep,
} from "@formations-initiales/src/extraction/application-service/extraire-flux-formations-initiales-onisep.usecase";
import { FluxExtraction } from "@formations-initiales/src/extraction/domain/model/flux";
import { Configuration } from "@formations-initiales/src/extraction/infrastructure/configuration/configuration";
import { CommandLog } from "@formations-initiales/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({ name: ExtractFlowOnisepSubCommand.FLOW_NAME })
export class ExtractFlowOnisepSubCommand extends CommandRunner {
  private static readonly FLOW_NAME = "onisep";

  constructor(
    private readonly usecase: ExtraireFluxFormationsInitialesOnisep,
    private readonly configuration: Configuration,
  ) {
    super();
  }

  @CommandLog(ExtractFlowOnisepSubCommand.FLOW_NAME)
  public async run(): Promise<void> {
    await this.usecase.executer(
      new FluxExtraction(
        this.configuration.ONISEP.NAME,
        this.configuration.ONISEP.RAW_FILE_EXTENSION,
        this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
        this.configuration.ONISEP.FLUX_URL,
      ),
    );
  }
}
