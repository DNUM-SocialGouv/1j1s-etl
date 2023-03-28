import { CommandRunner, SubCommand } from "nest-commander";

import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { Configuration } from "@maintenance/src/infrastructure/configuration/configuration";
import { CommandLog } from "@maintenance/src/infrastructure/configuration/log.decorator";

@SubCommand({ name: PurgeInternshipsSubCommand.PROCESS_NAME })
export class PurgeInternshipsSubCommand extends CommandRunner {
	public static readonly PROCESS_NAME = "purge-internships";

	constructor(private readonly usecase: PurgerLesOffresDeStage, private readonly configuration: Configuration) {
		super();
	}

	@CommandLog(PurgeInternshipsSubCommand.PROCESS_NAME)
	public async run(): Promise<void> {
		await this.usecase.executer(this.configuration.FLOWS);
	}
}
