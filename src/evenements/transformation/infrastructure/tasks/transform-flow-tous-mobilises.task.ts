import { Configuration } from "@evenements/transformation/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@evenements/transformation/configuration/log.decorator";
import { FluxTransformation } from "@evenements/transformation/domain/flux";
import {
	TransformerFluxTousMobilisesUseCase,
} from "@evenements/transformation/usecase/transformer-flux-tous-mobilises-use.case";

export class TransformFlowJobteaserTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxTousMobilisesUseCase,
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
