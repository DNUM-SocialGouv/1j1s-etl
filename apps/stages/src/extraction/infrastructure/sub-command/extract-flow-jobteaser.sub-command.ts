import { CommandRunner, SubCommand } from "nest-commander";

import { ExtraireJobteaser } from "@stages/src/extraction/application-service/extraire-jobteaser.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Configuration } from "@stages/src/extraction/infrastructure/configuration/configuration";
import { TaskLog } from "@stages/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({
	name: ExtractFlowJobteaserSubCommand.FLOW_NAME,
})
export class ExtractFlowJobteaserSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "jobteaser";

	constructor(private readonly usecase: ExtraireJobteaser, private readonly configuration: Configuration) {
		super();
	}

	@TaskLog(ExtractFlowJobteaserSubCommand.FLOW_NAME)
	public override async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.JOBTEASER.NAME,
				this.configuration.JOBTEASER.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.JOBTEASER.FLUX_URL,
			),
		);
	}
}
