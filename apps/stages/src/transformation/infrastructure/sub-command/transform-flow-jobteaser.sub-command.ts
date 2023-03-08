import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformerFluxJobteaser,
} from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Configuration } from "@stages/src/transformation/infrastructure/configuration/configuration";
import { TaskLog } from "@stages/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({
	name: TransformFlowJobteaserSubCommand.FLOW_NAME,
})
export class TransformFlowJobteaserSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "jobteaser";

	constructor(
		private readonly usecase: TransformerFluxJobteaser,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@TaskLog(TransformFlowJobteaserSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxTransformation(
				this.configuration.JOBTEASER.NAME,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
				this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION,
			),
		);
	}
}
