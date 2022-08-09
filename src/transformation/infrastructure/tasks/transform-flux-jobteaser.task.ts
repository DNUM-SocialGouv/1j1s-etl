import { Configuration } from "@configuration/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";

export class TransformFluxJobteaserTask implements Task {
	constructor(
		private readonly configuration: Configuration,
		private readonly usecase: TransformerFluxJobteaser,
		private readonly logger: Logger
	) {
	}

	async run(): Promise<void> {
		const configurationFlux: ConfigurationFlux = {
			nom: this.configuration.JOBTEASER.NAME,
			extensionFichierTransforme: this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION,
			extensionFichierBrut: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
		};

		this.logger.info(`Start transformation of flux [${configurationFlux.nom}]`);

		try {
			await this.usecase.executer(configurationFlux);
			this.logger.info(`Flux [${configurationFlux.nom}] has been successfully transformed`);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
