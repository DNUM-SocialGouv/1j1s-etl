import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { Configuration } from "@logements/src/extraction/infrastructure/configuration/configuration";
import { TaskLog } from "@logements/src/extraction/infrastructure/configuration/log.decorator";

import { Task } from "@shared/src/infrastructure/task/task";

export class ExtractFlowImmojeuneTask implements Task {
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
