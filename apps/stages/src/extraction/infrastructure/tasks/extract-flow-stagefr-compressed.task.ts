import { Task } from "@shared/src/infrastructure/task/task";

import { ExtraireStagefrCompresse } from "@stages/src/extraction/application-service/extraire-stagefr-compresse.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Configuration } from "@stages/src/extraction/infrastructure/configuration/configuration";
import { TaskLog } from "@stages/src/extraction/infrastructure/configuration/log.decorator";

export class ExtractFlowStagefrCompressedTask implements Task {
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
