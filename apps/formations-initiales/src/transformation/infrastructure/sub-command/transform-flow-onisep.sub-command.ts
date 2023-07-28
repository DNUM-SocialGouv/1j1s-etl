import { CommandRunner, SubCommand } from "nest-commander";

import {
  TransformerFluxOnisep,
} from "@formations-initiales/src/transformation/application-service/transformer-flux-onisep.usecase";
import { FluxTransformation } from "@formations-initiales/src/transformation/domain/model/flux";
import { Configuration } from "@formations-initiales/src/transformation/infrastructure/configuration/configuration";
import { CommandLog } from "@formations-initiales/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({ name: TransformFlowOnisepSubCommand.FLOW_NAME })
export class TransformFlowOnisepSubCommand extends CommandRunner {
  private static readonly FLOW_NAME = "onisep";

  constructor(
    private readonly usecase: TransformerFluxOnisep,
    private readonly configuration: Configuration,
  ) {
    super();
  }

  @CommandLog(TransformFlowOnisepSubCommand.FLOW_NAME)
  public async run(): Promise<void> {
    await this.usecase.executer(
      new FluxTransformation(
        this.configuration.ONISEP.NAME,
        this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
        this.configuration.ONISEP.RAW_FILE_EXTENSION,
        this.configuration.ONISEP.TRANSFORMED_FILE_EXTENSION,
      ),
    );
  }
}
