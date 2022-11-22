import {Task} from "@shared/infrastructure/task/task";
import {Configuration} from "@evenements/extraction/configuration/configuration";
import {
	ExtraireEvenementTousMobilisesUsecase,
} from "@evenements/extraction/usecase/extraire-evenementTousMobilises.usecase";
import {TaskLog} from "@evenements/extraction/configuration/log.decorator";
import {FluxExtraction} from "@evenements/extraction/domain/flux";

export class ExtractFluxEvenementTousMobilisesTask implements Task {

	constructor(
		private readonly usecase: ExtraireEvenementTousMobilisesUsecase,
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
