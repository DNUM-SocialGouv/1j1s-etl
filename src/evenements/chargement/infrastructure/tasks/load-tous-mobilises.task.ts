import { ChargerFluxTousMobilises } from "@evenements/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { Configuration } from "@evenements/chargement/configuration/configuration";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@evenements/chargement/configuration/log.decorator";

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
