import { CommandRunner, SubCommand } from "nest-commander";

import { TransformerFluxImmojeune } from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";
import { Configuration } from "@logements/src/transformation/infrastructure/configuration/configuration";
import { TaskLog } from "@logements/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({
	name: TransformFlowImmojeuneSubCommand.FLOW_NAME,
})
export class TransformFlowImmojeuneSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "immojeune";

	constructor(private readonly usecase: TransformerFluxImmojeune, private readonly config: Configuration) {
		super();
	}

	@TaskLog(TransformFlowImmojeuneSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		return await this.usecase.executer(new FluxTransformation(
			this.config.IMMOJEUNE.NAME,
			this.config.MINIO.HISTORY_DIRECTORY_NAME,
			this.config.IMMOJEUNE.RAW_FILE_EXTENSION,
			this.config.IMMOJEUNE.TRANSFORMED_FILE_EXTENSION,
		));
	}
}
