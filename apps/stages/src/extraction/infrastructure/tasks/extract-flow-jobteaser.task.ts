import { Configuration } from "@stages/src/extraction/configuration/configuration";
import { ExtraireJobteaser } from "@stages/src/extraction/application-service/extraire-jobteaser.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Task } from "@shared/src/infrastructure/task/task";
import { TaskLog } from "@stages/src/extraction/configuration/log.decorator";

export class ExtractFlowJobteaserTask implements Task {
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
