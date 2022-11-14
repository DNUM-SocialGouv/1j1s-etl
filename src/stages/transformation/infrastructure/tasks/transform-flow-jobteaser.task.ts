import { Configuration } from "@stages/transformation/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/transformation/configuration/log.decorator";
import { TransformerFluxJobteaser } from "@stages/transformation/usecase/transformer-flux-jobteaser.usecase";

export class TransformFlowJobteaserTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxJobteaser,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("jobteaser")
	public async run(): Promise<void> {
		await this.usecase.executer({
			nom: this.configuration.JOBTEASER.NAME,
			extensionFichierTransforme: this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION,
			extensionFichierBrut: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
		});
	}
}
