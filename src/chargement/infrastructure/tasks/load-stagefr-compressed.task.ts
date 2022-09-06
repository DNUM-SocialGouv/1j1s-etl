import { ChargerFluxStagefrCompresse } from "@chargement/usecase/charger-flux-stagefr-compresse.usecase";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@chargement/configuration/log.decorator";

export class LoadStagefrCompressedTask implements Task {
	constructor(private readonly chargerStagefrCompresse: ChargerFluxStagefrCompresse) {
	}

	@TaskLog("stagefr-compresse")
	public async run(): Promise<void> {
		await this.chargerStagefrCompresse.executer();
	}
}
