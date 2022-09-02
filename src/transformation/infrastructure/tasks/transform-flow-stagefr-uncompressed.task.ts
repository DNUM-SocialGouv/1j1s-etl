import { Configuration } from "@transformation/configuration/configuration";
import { Flux } from "@transformation/domain/flux";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";
import {
	TransformerFluxStagefrDecompresse,
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";

export class TransformFlowStagefrUncompressedTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxStagefrDecompresse,
		private readonly configuration: Configuration,
		private readonly logger: Logger
	) {
	}

	public async run(): Promise<void> {
		this.logger.info(`Starting transformation of flow [${this.configuration.STAGEFR_UNCOMPRESSED.NAME}]`);
		const flow: Flux = {
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			extensionFichierBrut: this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
			extensionFichierTransforme: this.configuration.STAGEFR_UNCOMPRESSED.TRANSFORMED_FILE_EXTENSION,
			nom: this.configuration.STAGEFR_UNCOMPRESSED.NAME,
		};

		try {
			await this.usecase.executer(flow);
		} catch (e) {
			this.logger.fatal({ msg: (<Error> e).message, extra: { stackTrace: (<Error> e).stack } });
		} finally {
			this.logger.info(`End of transformation of flow [${flow.nom}]`);
		}
	}
}
