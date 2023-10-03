import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformerFluxHellowork,
} from "@stages/src/transformation/application-service/transformer-flux-hellowork.usecase";
import { FluxTransformation } from "@stages/src/transformation/domain/model/flux";
import { Configuration } from "@stages/src/transformation/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({ name: TransformFlowHelloworkSubCommand.FLOW_NAME })
export class TransformFlowHelloworkSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "hellowork";

	constructor(
		private readonly usecase: TransformerFluxHellowork,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@CommandLog(TransformFlowHelloworkSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxTransformation(
				this.configuration.HELLOWORK.NAME,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.HELLOWORK.RAW_FILE_EXTENSION,
				this.configuration.HELLOWORK.TRANSFORMED_FILE_EXTENSION,
			),
		);
	}
}
