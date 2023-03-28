import { CommandRunner, SubCommand } from "nest-commander";

import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { Configuration } from "@logements/src/extraction/infrastructure/configuration/configuration";
import { CommandLog } from "@logements/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({ name: ExtractFlowStudapartSubCommand.FLOW_NAME })
export class ExtractFlowStudapartSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "studapart";

	constructor(private readonly usecase: ExtraireStudapart, private readonly configuration: Configuration) {
		super();
	}

	@CommandLog(ExtractFlowStudapartSubCommand.FLOW_NAME)
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
