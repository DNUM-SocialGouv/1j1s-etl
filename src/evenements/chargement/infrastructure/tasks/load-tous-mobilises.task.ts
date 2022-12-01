import { Configuration } from "@evenements/chargement/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@evenements/chargement/configuration/log.decorator";
import { ChargerFluxTousMobilisesUseCase } from "@evenements/chargement/usecase/charger-flux-tous-mobilises.usecase";

export class LoadTousMobilisesTask implements Task {
	constructor(
		private readonly chargerFluxTousMobilisesUseCase: ChargerFluxTousMobilisesUseCase,
		private readonly configuration: Configuration
	) {
	}

	@TaskLog("tous-mobilises")
	public async run(): Promise<void> {
		await this.chargerFluxTousMobilisesUseCase.executer(this.configuration.TOUS_MOBILISES.NAME);
	}
}
