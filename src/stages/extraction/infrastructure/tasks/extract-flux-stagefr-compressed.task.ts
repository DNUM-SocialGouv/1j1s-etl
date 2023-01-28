import { Configuration } from "@stages/extraction/configuration/configuration";
import { ExtraireStagefrCompresse } from "@stages/extraction/application-service/extraire-stagefr-compresse.usecase";
import { FluxExtraction } from "@stages/extraction/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/extraction/configuration/log.decorator";

export class ExtractFluxStagefrCompressedTask implements Task {
	constructor(
		private readonly usecase: ExtraireStagefrCompresse,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("stagefr-compresse")
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.STAGEFR_COMPRESSED.NAME,
				this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STAGEFR_COMPRESSED.FLUX_URL,
			),
		);
	}
}
