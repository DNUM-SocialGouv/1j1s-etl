import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import { FluxTransformation } from "@evenements/src/transformation/domain/model/flux";
import { Configuration } from "@evenements/src/transformation/infrastructure/configuration/configuration";
import { CommandLog } from "@evenements/src/transformation/infrastructure/configuration/log.decorator";

@SubCommand({
	name: TransformFlowTousMobilisesSubCommand.FLOW_NAME,
})
export class TransformFlowTousMobilisesSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "tous-mobilises";

	constructor(
		private readonly usecase: TransformerFluxTousMobilises,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@CommandLog(TransformFlowTousMobilisesSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxTransformation(
				this.configuration.TOUS_MOBILISES.NAME,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.TOUS_MOBILISES.RAW_FILE_EXTENSION,
				this.configuration.TOUS_MOBILISES.TRANSFORMED_FILE_EXTENSION,
			),
		);
	}
}
