import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@chargement/configuration/log.decorator";

export class LoadJobteaserTask implements Task {
	constructor(private readonly chargerJobteaser: ChargerFluxJobteaser) {
	}

	@TaskLog("jobteaser")
	public async run(): Promise<void> {
		await this.chargerJobteaser.executer();
	}
}
