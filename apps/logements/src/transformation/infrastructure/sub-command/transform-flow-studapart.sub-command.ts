import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformerFluxStudapart,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";
import { Configuration } from "@logements/src/transformation/infrastructure/configuration/configuration";
import { CommandLog } from "@logements/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({
	name: TransformFlowStudapartSubCommand.FLOW_NAME,
})
export class TransformFlowStudapartSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "studapart";

	constructor(private readonly usecase: TransformerFluxStudapart, private readonly config: Configuration) {
		super();
	}

	@CommandLog(TransformFlowStudapartSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		return await this.usecase.executer(new FluxTransformation(
			this.config.STUDAPART.NAME,
			this.config.MINIO.HISTORY_DIRECTORY_NAME,
			this.config.STUDAPART.RAW_FILE_EXTENSION,
			this.config.STUDAPART.TRANSFORMED_FILE_EXTENSION,
		));
	}
}
