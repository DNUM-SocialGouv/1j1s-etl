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

	public async run(): Promise<void> {
		try {
			this.logger.info(`Starting extraction from flow [${this.configuration.JOBTEASER.NAME}]`);
			const flow = {
				url: this.configuration.JOBTEASER.FLUX_URL,
				dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				nom: this.configuration.JOBTEASER.NAME,
				extension: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			};

			await this.usecase.executer<void>(flow);
		} catch (e) {
			this.logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
		} finally {
			this.logger.info(`End of extraction from flow [${this.configuration.JOBTEASER.NAME}]`);
		}
	}
}
