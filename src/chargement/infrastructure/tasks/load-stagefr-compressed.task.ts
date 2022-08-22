import { ChargerFluxStagefrCompresse } from "@chargement/usecase/charger-flux-stagefr-compresse.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";

export class LoadStagefrCompressedTask implements Task {
	constructor(
		private readonly chargerStagefrCompresse: ChargerFluxStagefrCompresse,
		private readonly logger: Logger,
	) {
	}

	async run(): Promise<void> {
		try {
			this.logger.info("Starting load of Stagefr Compressed flow");
			await this.chargerStagefrCompresse.executer();
			this.logger.info("Ending load of Stagefr Compressed flow");
		} catch (e) {
			this.logger.error(e);
		}
	}
}
