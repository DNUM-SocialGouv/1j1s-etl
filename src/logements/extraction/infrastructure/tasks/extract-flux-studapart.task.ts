import { Configuration } from "@logements/extraction/configuration/configuration";
import { ExtraireStudapart } from "@logements/extraction/application-service/extraire-studapart.usecase";
import { FluxExtraction } from "@logements/extraction/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@logements/extraction/configuration/log.decorator";

export class ExtractFluxStudapartTask implements Task {
	constructor(private readonly usecase: ExtraireStudapart, private readonly configuration: Configuration) {
	}

	@TaskLog("studapart")
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.STUDAPART.NAME,
				this.configuration.STUDAPART.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STUDAPART.URL,
			),
		);
	}
}
