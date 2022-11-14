import { Configuration } from "@stages/extraction/configuration/configuration";
import { ExtraireJobteaser } from "@stages/extraction/usecase/extraire-jobteaser.usecase";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/extraction/configuration/log.decorator";

export class ExtractFluxJobteaserTask implements Task {
	constructor(
		private readonly usecase: ExtraireJobteaser,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("jobteaser")
	public async run(): Promise<void> {
		await this.usecase.executer({
			url: this.configuration.JOBTEASER.FLUX_URL,
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			nom: this.configuration.JOBTEASER.NAME,
			extension: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
		});
	}
}
