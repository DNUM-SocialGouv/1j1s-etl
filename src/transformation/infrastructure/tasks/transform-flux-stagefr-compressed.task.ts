import { Configuration } from "@transformation/configuration/configuration";
import { Flux } from "@transformation/domain/flux";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";
import { TransformerFluxStagefrCompresse } from "@transformation/usecase/transformer-flux-stagefr-compresse.usecase";

export class TransformFluxStagefrCompressedTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxStagefrCompresse,
		private readonly configuration: Configuration,
		private readonly logger: Logger
	) {
	}

	async run(): Promise<void> {
		const flow: Flux = {
			dossierHistorisation: this.configuration.MINIO_HISTORY_DIRECTORY_NAME,
			extensionFichierBrut: this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
			extensionFichierTransforme: this.configuration.STAGEFR_COMPRESSED.TRANSFORMED_FILE_EXTENSION,
			nom: this.configuration.STAGEFR_COMPRESSED.NAME,
		};

		this.logger.info(`Start transformation of flux [${flow.nom}]`);

		try {
			await this.usecase.executer(flow);
			this.logger.info(`Flux [${flow.nom}] has been successfully transformed`);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
