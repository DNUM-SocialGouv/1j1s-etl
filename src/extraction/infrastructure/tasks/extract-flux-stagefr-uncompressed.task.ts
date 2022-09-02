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

	public async run(): Promise<void> {
        try {
			this.logger.info(`Starting extraction from flow [${this.configuration.STAGEFR_UNCOMPRESSED.NAME}]`);
			await this.usecase.executer({
				url: this.configuration.STAGEFR_UNCOMPRESSED.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				nom: this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				extension: this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
			});
		} catch (e) {
			this.logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
		} finally {
			this.logger.info(`End of extraction from flow [${this.configuration.STAGEFR_UNCOMPRESSED.NAME}]`);
        }
    }
}
