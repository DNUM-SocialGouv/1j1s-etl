import { ChargerFluxTousMobilises } from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { Configuration } from "@evenements/src/chargement/configuration/configuration";
import { TaskLog } from "@evenements/src/chargement/configuration/log.decorator";

import { Task } from "@shared/src/infrastructure/task/task";

export class LoadTousMobilisesTask implements Task {
	constructor(
		private readonly chargerFluxTousMobilisesUseCase: ChargerFluxTousMobilises,
		private readonly configuration: Configuration
	) {
	}

	@TaskLog("tous-mobilises")
	public async run(): Promise<void> {
		await this.chargerFluxTousMobilisesUseCase.executer(this.configuration.TOUS_MOBILISES.NAME);
	}
}
