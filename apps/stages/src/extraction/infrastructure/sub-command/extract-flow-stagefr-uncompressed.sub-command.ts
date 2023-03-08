import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtraireStagefrDecompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-decompresse.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Configuration } from "@stages/src/extraction/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({
	name: ExtractFlowStagefrUncompressedSubCommand.FLOW_NAME,
})
export class ExtractFlowStagefrUncompressedSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "stagefr-decompresse";

	constructor(
		private readonly usecase: ExtraireStagefrDecompresse,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@CommandLog(ExtractFlowStagefrUncompressedSubCommand.FLOW_NAME)
	public override async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.FLUX_URL,
			),
		);
	}
}
