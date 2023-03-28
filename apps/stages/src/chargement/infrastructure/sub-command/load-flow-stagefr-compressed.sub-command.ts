import { CommandRunner, SubCommand } from "nest-commander";

import {
	ChargerFluxStagefrCompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import { Configuration } from "@stages/src/chargement/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/chargement/infrastructure/configuration/log.decorator";

@SubCommand({ name: LoadFlowStagefrCompressedSubCommand.FLOW_NAME })
export class LoadFlowStagefrCompressedSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "stagefr-compresse";

	constructor(
		private readonly chargerStagefrCompresse: ChargerFluxStagefrCompresse,
		private readonly configuration: Configuration
	) {
		super();
	}

	@CommandLog(LoadFlowStagefrCompressedSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.chargerStagefrCompresse.executer(
			new FluxChargement(
				this.configuration.STAGEFR_COMPRESSED.NAME,
				this.configuration.STAGEFR_COMPRESSED.TRANSFORMED_FILE_EXTENSION
			)
		);
	}
}
