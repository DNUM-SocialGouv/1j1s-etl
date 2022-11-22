import { Configuration } from "@stages/transformation/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/transformation/configuration/log.decorator";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/transformation/usecase/transformer-flux-stagefr-decompresse.usecase";
import { FluxTransformation } from "@stages/transformation/domain/flux";

export class TransformFlowStagefrUncompressedTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxStagefrDecompresse,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("stagefr-decompresse")
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
