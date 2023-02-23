import { Task } from "@shared/src/infrastructure/task/task";

import { TransformerFluxJobteaser } from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import { Configuration } from "@stages/src/transformation/configuration/configuration";
import { TaskLog } from "@stages/src/transformation/configuration/log.decorator";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";

export class TransformFlowJobteaserTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxJobteaser,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("jobteaser")
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
