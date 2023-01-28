import { Configuration } from "@logements/transformation/configuration/configuration";
import { FluxTransformation } from "@logements/transformation/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@logements/transformation/configuration/log.decorator";
import { TransformerFluxImmojeune } from "@logements/transformation/application-service/transformer-flux-immojeune.usecase";

export class TransformFluxImmojeuneTask implements Task {
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
