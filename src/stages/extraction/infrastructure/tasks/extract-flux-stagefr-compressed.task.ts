import { Configuration } from "@stages/extraction/configuration/configuration";
import { ExtraireStagefrCompresse } from "@stages/extraction/usecase/extraire-stagefr-compresse.usecase";
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
		await this.usecase.executer({
			url: this.configuration.STAGEFR_COMPRESSED.FLUX_URL,
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			nom: this.configuration.STAGEFR_COMPRESSED.NAME,
			extension: this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
		});
	}
}
