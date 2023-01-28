import { Configuration } from "@evenements/transformation/configuration/configuration";
import { FluxTransformation } from "@evenements/transformation/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@evenements/transformation/configuration/log.decorator";
import {
	TransformerFluxTousMobilises,
} from "@evenements/transformation/application-service/transformer-flux-tous-mobilises.usecase";

export class TransformFlowJobteaserTask implements Task {
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
