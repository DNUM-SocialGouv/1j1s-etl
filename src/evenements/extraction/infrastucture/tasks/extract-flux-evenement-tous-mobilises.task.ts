import { Configuration } from "@evenements/extraction/configuration/configuration";
import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { FluxExtraction } from "@evenements/extraction/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@evenements/extraction/configuration/log.decorator";

export class ExtractFluxEvenementTousMobilisesTask implements Task {

	constructor(
		private readonly usecase: ExtraireFluxEvenementTousMobilises,
		private readonly configuration: Configuration,
	) {}

	@TaskLog("tous-mobilises")
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.TOUS_MOBILISES.NAME,
				this.configuration.TOUS_MOBILISES.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.TOUS_MOBILISES.FLUX_URL,
			),
		);
	}
}
