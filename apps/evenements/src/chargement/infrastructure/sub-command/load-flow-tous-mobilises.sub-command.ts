import { CommandRunner, SubCommand } from "nest-commander";

import { ChargerFluxTousMobilises } from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { Configuration } from "@evenements/src/chargement/infrastructure/configuration/configuration";
import { TaskLog } from "@evenements/src/chargement/infrastructure/configuration/log.decorator";

@SubCommand({
	name: LoadFlowTousMobilisesSubCommand.FLOW_NAME,
})
export class LoadFlowTousMobilisesSubCommand extends CommandRunner {
	private static readonly FLOW_NAME = "tous-mobilises";

	constructor(
		private readonly chargerFluxTousMobilisesUseCase: ChargerFluxTousMobilises,
		private readonly configuration: Configuration
	) {
		super();
	}

	@TaskLog(LoadFlowTousMobilisesSubCommand.FLOW_NAME)
	public async run(): Promise<void> {
		await this.chargerFluxTousMobilisesUseCase.executer(this.configuration.TOUS_MOBILISES.NAME);
	}
}
