import { ChargerFluxStagefrDecompresse } from "@chargement/usecase/charger-flux-stagefr-decompresse.usecase";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@chargement/configuration/log.decorator";

export class LoadStagefrUncompressedTask implements Task {
	constructor(private readonly chargerStagefrDecompresse: ChargerFluxStagefrDecompresse) {
	}

	@TaskLog("stagefr-decompresse")
	public async run(): Promise<void> {
		await this.chargerStagefrDecompresse.executer();
	}
}
