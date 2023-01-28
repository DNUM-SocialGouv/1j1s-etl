import { Configuration } from "@logements/transformation/configuration/configuration";
import { FluxTransformation } from "@logements/transformation/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@logements/transformation/configuration/log.decorator";
import { TransformerFluxStudapartUseCase } from "@logements/transformation/application-service/transformer-flux-studapart.usecase";

export class TransformFluxStudapartTask implements Task {
	constructor(private readonly useCase: TransformerFluxStudapartUseCase, private readonly config: Configuration) {
	}

	@TaskLog("studapart")
	public async run(): Promise<void> {
		return await this.useCase.executer(new FluxTransformation(
			this.config.STUDAPART.NAME,
			this.config.MINIO.HISTORY_DIRECTORY_NAME,
			this.config.STUDAPART.RAW_FILE_EXTENSION,
			this.config.STUDAPART.TRANSFORMED_FILE_EXTENSION,
		));
	}
}
