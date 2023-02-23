import { Task } from "@shared/src/infrastructure/task/task";

import { TransformerFluxStagefrCompresse } from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import { Configuration } from "@stages/src/transformation/configuration/configuration";
import { TaskLog } from "@stages/src/transformation/configuration/log.decorator";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";

export class TransformFlowStagefrCompressedTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxStagefrCompresse,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("stagefr-compresse")
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
