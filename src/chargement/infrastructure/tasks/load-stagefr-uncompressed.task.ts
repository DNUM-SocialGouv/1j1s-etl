import { ChargerFluxStagefrDecompresse } from "@chargement/usecase/charger-flux-stagefr-decompresse.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";

export class LoadStagefrUncompressedTask implements Task {
	constructor(
		private readonly chargerStagefrDecompresse: ChargerFluxStagefrDecompresse,
		private readonly logger: Logger,
	) {
	}

	async run(): Promise<void> {
		try {
			this.logger.info("Starting load of Stagefr Uncompressed flow");
			await this.chargerStagefrDecompresse.executer();
			this.logger.info("Ending load of Stagefr Uncompressed flow");
		} catch (e) {
			this.logger.error(e);
		}
	}
}
