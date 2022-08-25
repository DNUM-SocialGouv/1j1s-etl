import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/gateway/task";

export class LoadJobteaserTask implements Task {
	constructor(
		private readonly chargerJobteaser: ChargerFluxJobteaser,
		private readonly logger: Logger,
	) {
	}

	async run(): Promise<void> {
		try {
			this.logger.info("Starting load of [jobteaser] flow");
			await this.chargerJobteaser.executer();
			this.logger.info("Ending load of [jobteaser] flow");
		} catch (e) {
			this.logger.error(e);
		}
	}
}
