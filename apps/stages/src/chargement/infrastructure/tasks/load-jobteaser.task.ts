import { Task } from "@shared/src/infrastructure/task/task";

import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import { Configuration } from "@stages/src/chargement/configuration/configuration";
import { TaskLog } from "@stages/src/chargement/configuration/log.decorator";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";

export class LoadJobteaserTask implements Task {
	constructor(
		private readonly chargerJobteaser: ChargerFluxJobteaser,
		private readonly configuration: Configuration
	) {
	}

	@TaskLog("jobteaser")
	public async run(): Promise<void> {
		await this.chargerJobteaser.executer(
			new FluxChargement(this.configuration.JOBTEASER.NAME, this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION)
		);
	}
}
