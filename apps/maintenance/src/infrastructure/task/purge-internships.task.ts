import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { Configuration } from "@maintenance/src/infrastructure/configuration/configuration";
import { TaskLog } from "@maintenance/src/infrastructure/configuration/log.decorator";

import { Task } from "@shared/src/infrastructure/task/task";

export class PurgeInternshipsTask implements Task {
	constructor(private readonly usecase: PurgerLesOffresDeStage, private readonly configuration: Configuration) {
	}

	@TaskLog("purge-internships")
	public async run(): Promise<void> {
		await this.usecase.executer(this.configuration.FLOWS);
	}
}
