import { Task } from "@shared/src/infrastructure/task/task";

import { ExtraireStagefrDecompresse } from "@stages/src/extraction/application-service/extraire-stagefr-decompresse.usecase";
import { Configuration } from "@stages/src/extraction/configuration/configuration";
import { TaskLog } from "@stages/src/extraction/configuration/log.decorator";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";

export class ExtractFlowStagefrUncompressedTask implements Task {
	constructor(
		private readonly usecase: ExtraireStagefrDecompresse,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("stagefr-decompresse")
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.FLUX_URL,
			),
		);
	}
}
