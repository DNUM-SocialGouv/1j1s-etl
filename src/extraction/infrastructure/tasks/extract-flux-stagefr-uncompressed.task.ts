import { Configuration } from "@extraction/configuration/configuration";
import { ExtraireStagefrDecompresse } from "@extraction/usecase/extraire-stagefr-decompresse.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";

export class ExtractFluxStagefrUncompressedTask implements Task {
    constructor(
		private readonly usecase: ExtraireStagefrDecompresse,
		private readonly configuration: Configuration,
		private readonly logger: Logger
	) {
	}

    async run(): Promise<void> {
        try {
			await this.usecase.executer({
				url: this.configuration.STAGEFR_UNCOMPRESSED.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
				nom: this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				extension: this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
			});
			this.logger.info(`Flux ${this.configuration.STAGEFR_UNCOMPRESSED.NAME} has been succesfully extracted.`);
		} catch (e) {
			this.logger.error(e);
		}
    }
}
