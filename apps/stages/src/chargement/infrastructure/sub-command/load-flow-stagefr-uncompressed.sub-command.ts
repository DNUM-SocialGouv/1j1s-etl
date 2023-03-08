import { CommandRunner, SubCommand } from "nest-commander";

import {
	ChargerFluxStagefrDecompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import { Configuration } from "@stages/src/chargement/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/chargement/infrastructure/configuration/log.decorator";

@SubCommand({
	name: LoadFlowStagefrUncompressedSubCommand.FLOW_NAME,
})
export class LoadFlowStagefrUncompressedSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "stagefr-decompresse";

	constructor(
		private readonly chargerStagefrDecompresse: ChargerFluxStagefrDecompresse,
		private readonly configuration: Configuration
	) {
		super();
	}

	@CommandLog(LoadFlowStagefrUncompressedSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.chargerStagefrDecompresse.executer(
			new FluxChargement(
				this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.TRANSFORMED_FILE_EXTENSION
			)
		);
	}
}
