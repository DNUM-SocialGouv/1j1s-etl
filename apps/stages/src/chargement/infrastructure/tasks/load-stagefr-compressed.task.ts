import { ChargerFluxStagefrCompresse } from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import { Configuration } from "@stages/src/chargement/configuration/configuration";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import { Task } from "@shared/src/infrastructure/task/task";
import { TaskLog } from "@stages/src/chargement/configuration/log.decorator";

export class LoadStagefrCompressedTask implements Task {
	constructor(
		private readonly chargerStagefrCompresse: ChargerFluxStagefrCompresse,
		private readonly configuration: Configuration
	) {
	}

	@TaskLog("stagefr-compresse")
	public async run(): Promise<void> {
		await this.chargerStagefrCompresse.executer(
			new FluxChargement(
				this.configuration.STAGEFR_COMPRESSED.NAME,
				this.configuration.STAGEFR_COMPRESSED.TRANSFORMED_FILE_EXTENSION
			)
		);
	}
}
