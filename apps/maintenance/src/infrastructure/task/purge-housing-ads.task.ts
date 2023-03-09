import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { Configuration } from "@maintenance/src/infrastructure/configuration/configuration";
import { TaskLog } from "@maintenance/src/infrastructure/configuration/log.decorator";

import { Task } from "@shared/src/infrastructure/task/task";

export class PurgeHousingAdsTask implements Task {
	constructor(private readonly usecase: PurgerLesAnnoncesDeLogement, private readonly configuration: Configuration) {
	}

	@TaskLog("purge-housing-ads")
	public async run(): Promise<void> {
		await this.usecase.executer(this.configuration.FLOWS);
	}
}
