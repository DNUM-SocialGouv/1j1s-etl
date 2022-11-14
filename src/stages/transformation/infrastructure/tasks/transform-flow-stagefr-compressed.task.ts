import { Configuration } from "@stages/transformation/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/transformation/configuration/log.decorator";
import { TransformerFluxStagefrCompresse } from "@stages/transformation/usecase/transformer-flux-stagefr-compresse.usecase";

export class TransformFlowStagefrCompressedTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxStagefrCompresse,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("stagefr-compresse")
	public async run(): Promise<void> {
		await this.usecase.executer({
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			extensionFichierBrut: this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
			extensionFichierTransforme: this.configuration.STAGEFR_COMPRESSED.TRANSFORMED_FILE_EXTENSION,
			nom: this.configuration.STAGEFR_COMPRESSED.NAME,
		});
	}
}
