import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtraireStagefrCompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-compresse.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Configuration } from "@stages/src/extraction/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({ name: ExtractFlowStagefrCompressedSubCommand.FLOW_NAME })
export class ExtractFlowStagefrCompressedSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "stagefr-compresse";

	constructor(
		private readonly usecase: ExtraireStagefrCompresse,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@CommandLog(ExtractFlowStagefrCompressedSubCommand.FLOW_NAME)
	public override async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.STAGEFR_COMPRESSED.NAME,
				this.configuration.STAGEFR_COMPRESSED.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.STAGEFR_COMPRESSED.FLUX_URL,
			),
		);
	}
}
