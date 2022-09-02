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
			this.logger.info("Starting load from [stagefr-decompresse] flow");
			await this.chargerStagefrDecompresse.executer();
		} catch (e) {
			this.logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
		} finally {
			this.logger.info("End of loading from [stagefr-decompresse] flow");
		}
	}
}
