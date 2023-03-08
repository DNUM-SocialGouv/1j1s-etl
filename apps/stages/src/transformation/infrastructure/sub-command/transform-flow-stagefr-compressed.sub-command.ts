import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformerFluxStagefrCompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Configuration } from "@stages/src/transformation/infrastructure/configuration/configuration";
import { TaskLog } from "@stages/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({
	name: TransformFlowStagefrCompressedSubCommand.FLOW_NAME,
})
export class TransformFlowStagefrCompressedSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "stagefr-compresse";

	constructor(
		private readonly usecase: TransformerFluxStagefrCompresse,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@TaskLog(TransformFlowStagefrCompressedSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxTransformation(
				this.configuration.STAGEFR_COMPRESSED.NAME,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
				this.configuration.STAGEFR_COMPRESSED.TRANSFORMED_FILE_EXTENSION,
			),
		);
	}
}
