import { Configuration } from "@stages/extraction/configuration/configuration";
import { ExtraireJobteaser } from "@stages/extraction/application-service/extraire-jobteaser.usecase";
import { FluxExtraction } from "@stages/extraction/domain/model/flux";
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
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.JOBTEASER.NAME,
				this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.JOBTEASER.FLUX_URL,
			),
		);
	}
}
