import { ChargerFluxJobteaser } from "@chargement/usecase/charger-flux-jobteaser.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";

export class LoadJobteaserTask implements Task {
	constructor(
		private readonly chargerJobteaser: ChargerFluxJobteaser,
		private readonly logger: Logger,
	) {
	}

	public async run(): Promise<void> {
		try {
			this.logger.info("Starting load from [jobteaser] flow");
			await this.chargerJobteaser.executer();
		} catch (e) {
			this.logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
		} finally {
			this.logger.info("Ending load frm [jobteaser] flow");
		}
	}
}
