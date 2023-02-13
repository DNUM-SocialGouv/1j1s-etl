import { Configuration } from "@evenements/src/extraction/configuration/configuration";
import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { FluxExtraction } from "@evenements/src/extraction/domain/model/flux";
import { Task } from "@shared/src/infrastructure/task/task";
import { TaskLog } from "@evenements/src/extraction/configuration/log.decorator";

export class ExtractFlowTousMobilisesTask implements Task {

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
