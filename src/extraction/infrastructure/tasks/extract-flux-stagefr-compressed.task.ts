import { Configuration } from "@extraction/configuration/configuration";
import { ExtraireStagefrCompresse } from "@extraction/usecase/extraire-stagefr-compresse.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";

export class ExtractFluxStagefrCompressedTask implements Task {
	constructor(
		private readonly usecase: ExtraireStagefrCompresse,
		private readonly configuration: Configuration,
		private readonly logger: Logger
	) {
	}

	public async run(): Promise<void> {
		try {
			await this.usecase.executer({
				url: this.configuration.STAGEFR_COMPRESSED.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				nom: this.configuration.STAGEFR_COMPRESSED.NAME,
				extension: this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
			});
		} catch (e) {
			this.logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
		} finally {
			this.logger.info(`End of extraction from flow [${this.configuration.STAGEFR_COMPRESSED.NAME}]`);
		}
	}
}
