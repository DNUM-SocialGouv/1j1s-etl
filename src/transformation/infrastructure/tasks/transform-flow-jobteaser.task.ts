import { Configuration } from "@transformation/configuration/configuration";
import { Flux } from "@transformation/domain/flux";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";

export class TransformFlowJobteaserTask implements Task {
	constructor(
		private readonly usecase: TransformerFluxJobteaser,
		private readonly configuration: Configuration,
		private readonly logger: Logger
	) {
	}

	public async run(): Promise<void> {
		this.logger.info(`Starting transformation of flow [${this.configuration.JOBTEASER.NAME}]`);
		const flow: Flux = {
			nom: this.configuration.JOBTEASER.NAME,
			extensionFichierTransforme: this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION,
			extensionFichierBrut: this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
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
