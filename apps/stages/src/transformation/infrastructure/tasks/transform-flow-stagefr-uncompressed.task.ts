import { Task } from "@shared/src/infrastructure/task/task";

import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { Configuration } from "@stages/src/transformation/configuration/configuration";
import { TaskLog } from "@stages/src/transformation/configuration/log.decorator";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";

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
