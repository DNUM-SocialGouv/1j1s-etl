import { Configuration } from "@transformation/configuration/configuration";
import { Flux } from "@transformation/domain/flux";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";

export class TransformFlowJobteaserTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxJobteaser,
		private readonly configuration: Configuration,
		private readonly logger: Logger
	) {
	}

	async run(): Promise<void> {
		const flux: Flux = {
			nom: this.configuration.JOBTEASER.NAME,
			extensionFichierTransforme: this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION,
			extensionFichierBrut: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
		};

		this.logger.info(`Start transformation of flux [${flux.nom}]`);

		try {
			await this.usecase.executer(flux);
			this.logger.info(`Flux [${flux.nom}] has been successfully transformed`);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
