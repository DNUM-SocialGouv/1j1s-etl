import { Configuration } from "@extraction/configuration/configuration";
import { ExtraireJobteaser } from "@extraction/usecase/extraire-jobteaser.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";

export class ExtractFluxJobteaserTask implements Task {
	constructor(
		private readonly usecase: ExtraireJobteaser,
		private readonly configuration: Configuration,
		private readonly logger: Logger,
	) {
	}

	async run(): Promise<void> {
		try {
			const flow = {
				url: this.configuration.JOBTEASER.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
				nom: this.configuration.JOBTEASER.NAME,
				extension: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			};

			await this.usecase.executer<void>(flow);

			this.logger.info(`Flux [${this.configuration.JOBTEASER.NAME}] has been succesfully extracted.`);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
