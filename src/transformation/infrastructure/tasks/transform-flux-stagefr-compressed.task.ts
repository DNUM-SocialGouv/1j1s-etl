import { Configuration } from "@configuration/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";
import { 
	TransformerFluxStagefrCompresse 
} from "@transformation/usecase/transformer-flux-stagefr-compresse.usecase";

export class TransformFluxStagefrCompressedTask implements Task {
	constructor(
		private readonly configuration: Configuration,
		private readonly usecase: TransformerFluxStagefrCompresse,
		private readonly logger: Logger
	) {
	}

	async run(): Promise<void> {
		const configurationFlux: ConfigurationFlux = {
			dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
			extensionFichierBrut: this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
			extensionFichierTransforme: this.configuration.STAGEFR_COMPRESSED.TRANSFORMED_FILE_EXTENSION,
			nom: this.configuration.STAGEFR_COMPRESSED.NAME,
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
