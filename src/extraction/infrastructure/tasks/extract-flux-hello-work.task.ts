import { Configuration } from "@extraction/configuration/configuration";
import { TaskLog } from "@extraction/configuration/log.decorator";
import { ExtraireHelloWork } from "@extraction/usecase/extraire-hello-work.usecase";
import { Task } from "@shared/infrastructure/task/task";


export class ExtractHelloWorkTask implements Task {
    constructor(
		private readonly usecase: ExtraireHelloWork,
		private readonly configuration: Configuration,
	) {
	}

	@TaskLog("hello-work")
	public async run(): Promise<void> {
		await this.usecase.executer({
			url: this.configuration.HELLO_WORK.FLUX_URL,
			dossierHistorisation: this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
			nom: this.configuration.HELLO_WORK.NAME,
			extension: this.configuration.HELLO_WORK.RAW_FILE_EXTENSION,
		});
	}

}