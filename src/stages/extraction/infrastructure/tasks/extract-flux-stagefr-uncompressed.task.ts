import { Configuration } from "@stages/extraction/configuration/configuration";
import { ExtraireStagefrDecompresse } from "@stages/extraction/usecase/extraire-stagefr-decompresse.usecase";
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
		await this.usecase.executer({
			url: this.configuration.STAGEFR_UNCOMPRESSED.FLUX_URL,
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			nom: this.configuration.STAGEFR_UNCOMPRESSED.NAME,
			extension: this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
		});
	}
}
