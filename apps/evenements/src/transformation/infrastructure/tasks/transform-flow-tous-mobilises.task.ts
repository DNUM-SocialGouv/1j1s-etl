import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import { FluxTransformation } from "@evenements/src/transformation/domain/model/flux";
import { Configuration } from "@evenements/src/transformation/infrastructure/configuration/configuration";
import { TaskLog } from "@evenements/src/transformation/infrastructure/configuration/log.decorator";

import { Task } from "@shared/src/infrastructure/task/task";

export class TransformFlowTousMobilisesTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxTousMobilises,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("tous-mobilises")
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxTransformation(
				this.configuration.TOUS_MOBILISES.NAME,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.TOUS_MOBILISES.RAW_FILE_EXTENSION,
				this.configuration.TOUS_MOBILISES.TRANSFORMED_FILE_EXTENSION,
			),
		);
	}
}
