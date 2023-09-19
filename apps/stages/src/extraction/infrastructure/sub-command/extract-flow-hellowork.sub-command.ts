import { CommandRunner, SubCommand } from "nest-commander";

import { ExtraireHellowork } from "@stages/src/extraction/application-service/extraire-hellowork.usecase";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Configuration } from "@stages/src/extraction/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({ name: ExtractFlowHelloworkSubCommand.FLOW_NAME })
export class ExtractFlowHelloworkSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "hellowork";

	constructor(private readonly usecase: ExtraireHellowork, private readonly configuration: Configuration) {
		super();
	}

	@CommandLog(ExtractFlowHelloworkSubCommand.FLOW_NAME)
	public override async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.HELLOWORK.NAME,
				this.configuration.HELLOWORK.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.HELLOWORK.FLUX_URL,
			),
		);
	}
}
