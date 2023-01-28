import { Configuration } from "@logements/extraction/configuration/configuration";
import { ExtraireImmojeune } from "@logements/extraction/application-service/extraire-immojeune.usecase";
import { FluxExtraction } from "@logements/extraction/domain/model/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@logements/extraction/configuration/log.decorator";

export class ExtractFluxImmojeuneTask implements Task {
	constructor(private readonly usecase: ExtraireImmojeune, private readonly configuration: Configuration) {
	}

	@TaskLog("immojeune")
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.IMMOJEUNE.NAME,
				this.configuration.IMMOJEUNE.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.IMMOJEUNE.URL,
			),
		);
	}
}
