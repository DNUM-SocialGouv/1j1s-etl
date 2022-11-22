import { Configuration } from "@stages/extraction/configuration/configuration";
import { ExtraireStagefrDecompresse } from "@stages/extraction/usecase/extraire-stagefr-decompresse.usecase";
import { FluxExtraction } from "@stages/extraction/domain/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/extraction/configuration/log.decorator";

export class ExtractFluxStagefrUncompressedTask implements Task {
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
