import { ChargerFluxJobteaser } from "@stages/chargement/usecase/charger-flux-jobteaser.usecase";
import { Configuration } from "@stages/chargement/configuration/configuration";
import { FluxChargement } from "@stages/chargement/domain/1jeune1solution/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/chargement/configuration/log.decorator";

export class LoadJobteaserTask implements Task {
	constructor(
		private readonly chargerJobteaser: ChargerFluxJobteaser,
		private readonly configuration: Configuration
	) {
	}

	@TaskLog("jobteaser")
	public async run(): Promise<void> {
		throw new Error("Oops something went wrong!");
		await this.chargerJobteaser.executer(
			new FluxChargement(this.configuration.JOBTEASER.NAME, this.configuration.JOBTEASER.TRANSFORMED_FILE_EXTENSION)
		);
	}
}
