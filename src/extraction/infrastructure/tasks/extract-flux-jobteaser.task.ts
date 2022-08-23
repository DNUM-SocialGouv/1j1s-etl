import { Configuration } from "@configuration/configuration";
import { ExtraireJobteaser } from "@extraction/usecase/extraire-jobteaser.usecase";
import { Task } from "@shared/gateway/task";
import { Logger } from "@shared/configuration/logger";

export class ExtractFluxJobteaserTask implements Task {
	constructor(
		private readonly configuration: Configuration,
		private readonly usecase: ExtraireJobteaser,
		private readonly logger: Logger,
	) {
	}

	async run(): Promise<void> {
		try {
			const configurationFlux = {
				url: this.configuration.JOBTEASER.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
				nom: this.configuration.JOBTEASER.NAME,
				extension: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			};

			await this.usecase.executer<void>(configurationFlux);

			this.logger.info(`Flux ${this.configuration.JOBTEASER.NAME} has been succesfully extracted.`);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
