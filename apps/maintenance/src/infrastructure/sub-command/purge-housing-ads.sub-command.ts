import { CommandRunner, SubCommand } from "nest-commander";

import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { Configuration } from "@maintenance/src/infrastructure/configuration/configuration";
import { CommandLog } from "@maintenance/src/infrastructure/configuration/log.decorator";

@SubCommand({ name: PurgeHousingAdsSubCommand.PROCESS_NAME })
export class PurgeHousingAdsSubCommand extends CommandRunner {
	public static readonly PROCESS_NAME = "purge-housing-ads";

	constructor(private readonly usecase: PurgerLesAnnoncesDeLogement, private readonly configuration: Configuration) {
		super();
	}

	@CommandLog(PurgeHousingAdsSubCommand.PROCESS_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(this.configuration.FLOWS);
	}
}
