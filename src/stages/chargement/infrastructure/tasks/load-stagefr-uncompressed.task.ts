import { ChargerFluxStagefrDecompresse } from "@stages/chargement/usecase/charger-flux-stagefr-decompresse.usecase";
import { FluxChargement } from "@stages/chargement/domain/1jeune1solution/flux";
import { Task } from "@shared/infrastructure/task/task";
import { TaskLog } from "@stages/chargement/configuration/log.decorator";
import { Configuration } from "@stages/chargement/configuration/configuration";

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
