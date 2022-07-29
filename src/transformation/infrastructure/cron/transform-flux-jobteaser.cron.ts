import { CronJob } from "cron";

import { Configuration } from "@configuration/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { Cron } from "@transformation/infrastructure/cron/cron";
import { Logger } from "@shared/configuration/logger";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";

export class TransformFluxJobteaserCron implements Cron {
	constructor(
		private readonly configuration: Configuration,
		private readonly usecase: TransformerFluxJobteaser,
		private readonly logger: Logger
	) {
	}

	init(): CronJob {
		return new CronJob({
			runOnInit: true,
			start: true,
			timeZone: "Europe/paris",
			onTick: (): void => {
				const configurationFlux: ConfigurationFlux = {
					nom: this.configuration.JOBTEASER.NAME,
					extensionFichierJson: this.configuration.JOBTEASER.JSON_FILE_EXTENSION,
					extensionFichierBrut: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
					dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
				};

				this.usecase.executer(configurationFlux)
					.then(() => {
						this.logger.info("Cron worked");
					})
					.catch(e => this.logger.error(e));
			},
			cronTime: "* */10 * * *",
		});
	}
}
