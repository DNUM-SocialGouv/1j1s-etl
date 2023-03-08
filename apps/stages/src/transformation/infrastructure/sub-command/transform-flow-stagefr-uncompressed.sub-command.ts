import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Configuration } from "@stages/src/transformation/infrastructure/configuration/configuration";
import { TaskLog } from "@stages/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({
	name: TransformFlowStagefrUncompressedSubCommand.FLOW_NAME,
})
export class TransformFlowStagefrUncompressedSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "stagefr-decompresse";

	constructor(
		private readonly usecase: TransformerFluxStagefrDecompresse,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@TaskLog(TransformFlowStagefrUncompressedSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxTransformation(
				this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
				this.configuration.STAGEFR_UNCOMPRESSED.TRANSFORMED_FILE_EXTENSION,
			),
		);
	}
}
