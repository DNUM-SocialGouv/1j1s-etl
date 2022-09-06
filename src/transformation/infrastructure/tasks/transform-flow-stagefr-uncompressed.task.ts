import { Configuration } from "@transformation/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@transformation/configuration/log.decorator";
import {
	TransformerFluxStagefrDecompresse,
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";

export class TransformFlowStagefrUncompressedTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxStagefrDecompresse,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("stagefr-decompresse")
	public async run(): Promise<void> {
		await this.usecase.executer({
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			extensionFichierBrut: this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
			extensionFichierTransforme: this.configuration.STAGEFR_UNCOMPRESSED.TRANSFORMED_FILE_EXTENSION,
			nom: this.configuration.STAGEFR_UNCOMPRESSED.NAME,
		});
	}
}
