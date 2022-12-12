import { Configuration } from "@logements/extraction/configuration/configuration";
import { FluxExtraction } from "@logements/extraction/domain/flux";
import { Task } from "@shared/infrastructure/task/task";
import { Usecase } from "@shared/usecase";
import { TaskLog } from "@logements/extraction/configuration/log.decorator";

export class ExtractFluxStudapartTask implements Task {
	constructor(private readonly useCase: Usecase, private readonly configuration: Configuration) {
	}

	@TaskLog("studapart")
	public async run(): Promise<void> {
		await this.useCase.executer(
			new FluxExtraction(
				this.configuration.STUDAPART.NAME,
				this.configuration.STUDAPART.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STUDAPART.URL,
			),
		);
	}
}
