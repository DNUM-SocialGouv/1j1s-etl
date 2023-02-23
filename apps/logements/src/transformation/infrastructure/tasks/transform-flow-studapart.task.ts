import { TransformerFluxStudapart } from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import { Configuration } from "@logements/src/transformation/configuration/configuration";
import { TaskLog } from "@logements/src/transformation/configuration/log.decorator";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";

import { Task } from "@shared/src/infrastructure/task/task";

export class TransformFlowStudapartTask implements Task {
	constructor(private readonly usecase: TransformerFluxStudapart, private readonly config: Configuration) {
	}

	@TaskLog("studapart")
	public async run(): Promise<void> {
		return await this.usecase.executer(new FluxTransformation(
			this.config.STUDAPART.NAME,
			this.config.MINIO.HISTORY_DIRECTORY_NAME,
			this.config.STUDAPART.RAW_FILE_EXTENSION,
			this.config.STUDAPART.TRANSFORMED_FILE_EXTENSION,
		));
	}
}
