import { Configuration } from "@configuration/configuration";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";
import {
	TransformerFluxStagefrDecompresse
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";

export class TransformFluxStagefrUncompressedTask implements Task {
	constructor(
		private readonly configuration: Configuration,
		private readonly usecase: TransformerFluxStagefrDecompresse,
		private readonly logger: Logger
	) {
	}

	async run(): Promise<void> {
		const configurationFlux: ConfigurationFlux = {
			dossierHistorisation: this.configuration.STAGEFR_UNCOMPRESSED.DIRECTORY_NAME,
			extensionFichierBrut: this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
			extensionFichierTransforme: this.configuration.STAGEFR_UNCOMPRESSED.TRANSFORMED_FILE_EXTENSION,
			nom: this.configuration.STAGEFR_UNCOMPRESSED.NAME,
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
