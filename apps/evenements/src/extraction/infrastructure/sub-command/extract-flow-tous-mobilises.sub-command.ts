import { CommandRunner, SubCommand } from "nest-commander";

import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { FluxExtraction } from "@evenements/src/extraction/domain/model/flux";
import { Configuration } from "@evenements/src/extraction/infrastructure/configuration/configuration";
import { CommandLog } from "@evenements/src/extraction/infrastructure/configuration/log.decorator";

@SubCommand({ name: ExtractFlowTousMobilisesSubCommand.FLOW_NAME })
export class ExtractFlowTousMobilisesSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "tous-mobilises";

	constructor(
		private readonly usecase: ExtraireFluxEvenementTousMobilises,
		private readonly configuration: Configuration,
	) {
		super();
	}

	@CommandLog(ExtractFlowTousMobilisesSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(
			new FluxExtraction(
				this.configuration.TOUS_MOBILISES.NAME,
				this.configuration.TOUS_MOBILISES.RAW_FILE_EXTENSION,
				this.configuration.MINIO.HISTORY_DIRECTORY_NAME,
				this.configuration.TOUS_MOBILISES.FLUX_URL,
			),
		);
	}
}
