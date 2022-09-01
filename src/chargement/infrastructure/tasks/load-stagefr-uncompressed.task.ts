import { ChargerFluxStagefrDecompresse } from "@chargement/usecase/charger-flux-stagefr-decompresse.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";

export class LoadStagefrUncompressedTask implements Task {
	constructor(
		private readonly chargerStagefrDecompresse: ChargerFluxStagefrDecompresse,
		private readonly logger: Logger,
	) {
	}

	public async run(): Promise<void> {
		try {
			this.logger.info("Starting load of [stagefr-decompresse] flow");
			await this.chargerStagefrDecompresse.executer();
			this.logger.info("Ending load of [stagefr-decompresse] flow");
		} catch (e) {
			this.logger.error(e);
		}
	}
}
