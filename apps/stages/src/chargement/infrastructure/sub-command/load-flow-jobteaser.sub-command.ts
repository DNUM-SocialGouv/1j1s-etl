import { CommandRunner, SubCommand } from "nest-commander";

import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import { Configuration } from "@stages/src/chargement/infrastructure/configuration/configuration";
import { CommandLog } from "@stages/src/chargement/infrastructure/configuration/log.decorator";

@SubCommand({ name: LoadFlowJobteaserSubCommand.FLOW_NAME })
export class LoadFlowJobteaserSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "jobteaser";

	constructor(
		private readonly chargerJobteaser: ChargerFluxJobteaser,
		private readonly configuration: Configuration
	) {
		super();
	}

	@CommandLog(LoadFlowJobteaserSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.chargerJobteaser.executer(
			new FluxChargement(this.configuration.JOBTEASER.NAME, this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION)
		);
	}
}
