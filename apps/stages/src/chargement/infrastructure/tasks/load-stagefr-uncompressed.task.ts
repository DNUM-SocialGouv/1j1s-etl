import { Task } from "@shared/src/infrastructure/task/task";

import { ChargerFluxStagefrDecompresse } from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { Configuration } from "@stages/src/chargement/configuration/configuration";
import { TaskLog } from "@stages/src/chargement/configuration/log.decorator";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";

export class LoadStagefrUncompressedTask implements Task {
	constructor(private readonly chargerStagefrDecompresse: ChargerFluxStagefrDecompresse, private readonly configuration: Configuration) {
	}

	@TaskLog("stagefr-decompresse")
	public async run(): Promise<void> {
		await this.chargerStagefrDecompresse.executer(
			new FluxChargement(
				this.configuration.STAGEFR_UNCOMPRESSED.NAME,
				this.configuration.STAGEFR_UNCOMPRESSED.TRANSFORMED_FILE_EXTENSION
			)
		);
	}
}
