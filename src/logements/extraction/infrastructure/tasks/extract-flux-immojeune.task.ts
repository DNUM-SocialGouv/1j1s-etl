import { Configuration } from "@logements/extraction/configuration/configuration";
import { FluxExtraction } from "@logements/extraction/domain/flux";
import { Task } from "@shared/infrastructure/task/task";
import { Usecase } from "@shared/usecase";

export class ExtractFluxImmojeuneTask implements Task {
	constructor(private readonly usecase: Usecase, private readonly configuration: Configuration) {
	}

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
