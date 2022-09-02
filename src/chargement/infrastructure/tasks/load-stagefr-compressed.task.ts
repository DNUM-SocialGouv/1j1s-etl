import { ChargerFluxStagefrCompresse } from "@chargement/usecase/charger-flux-stagefr-compresse.usecase";
import { Logger } from "@shared/configuration/logger";
import { Task } from "@shared/infrastructure/task/task";

export class LoadStagefrCompressedTask implements Task {
	constructor(
		private readonly chargerStagefrCompresse: ChargerFluxStagefrCompresse,
		private readonly logger: Logger,
	) {
	}

	public async run(): Promise<void> {
		try {
			this.logger.info("Starting load from [stagefr-compresse] flow");
			await this.chargerStagefrCompresse.executer();
		} catch (e) {
			this.logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
		} finally {
			this.logger.info("End of loading from [stagefr-compresse] flow");
		}
	}
}
