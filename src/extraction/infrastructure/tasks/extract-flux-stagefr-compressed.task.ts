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

	async run(): Promise<void> {
		try {
			await this.usecase.executer({
				url: this.configuration.STAGEFR_COMPRESSED.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
				nom: this.configuration.STAGEFR_COMPRESSED.NAME,
				extension: this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
			});
			this.logger.info(`Flux ${this.configuration.STAGEFR_COMPRESSED.NAME} has been succesfully extracted.`);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
