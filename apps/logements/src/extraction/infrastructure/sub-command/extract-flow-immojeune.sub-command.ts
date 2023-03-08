import { CommandRunner, SubCommand } from "nest-commander";

import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { Configuration } from "@logements/src/extraction/infrastructure/configuration/configuration";
import { TaskLog } from "@logements/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({
	name: ExtractFlowImmojeuneSubCommand.FLOW_NAME,
})
export class ExtractFlowImmojeuneSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "immojeune";

	constructor(private readonly usecase: ExtraireImmojeune, private readonly configuration: Configuration) {
		super();
	}

	@TaskLog(ExtractFlowImmojeuneSubCommand.FLOW_NAME)
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
