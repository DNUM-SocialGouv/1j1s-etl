import { TransformerFluxImmojeune } from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import { Configuration } from "@logements/src/transformation/configuration/configuration";
import { TaskLog } from "@logements/src/transformation/configuration/log.decorator";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";

import { Task } from "@shared/src/infrastructure/task/task";

export class TransformFlowImmojeuneTask implements Task {
	constructor(private readonly usecase: TransformerFluxImmojeune, private readonly config: Configuration) {
	}

	@TaskLog("immojeune")
	public async run(): Promise<void> {
		return await this.usecase.executer(new FluxTransformation(
			this.config.IMMOJEUNE.NAME,
			this.config.MINIO.HISTORY_DIRECTORY_NAME,
			this.config.IMMOJEUNE.RAW_FILE_EXTENSION,
			this.config.IMMOJEUNE.TRANSFORMED_FILE_EXTENSION,
		));
	}
}
