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
			cronTime: this.configuration.JOBTEASER.CRON_TIME,
			runOnInit: this.configuration.JOBTEASER.CRON_RUN_ON_INIT,
			start: this.configuration.JOBTEASER.CRON_ENABLED,
			timeZone: this.configuration.CRON_TIMEZONE,
			onTick: (): void => {
				const configurationFlux: ConfigurationFlux = {
					nom: this.configuration.JOBTEASER.NAME,
					extensionFichierTransforme: this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION,
					extensionFichierBrut: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
					dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
				};

				this.logger.info(`Start transformation of flux [${configurationFlux.nom}]`);

				this.usecase.executer(configurationFlux)
					.then(() => {
						this.logger.info(`Flux [${configurationFlux.nom}] has been successfully transformed`);
					})
					.catch(e => this.logger.error(e));
			},
		});
	}
}
