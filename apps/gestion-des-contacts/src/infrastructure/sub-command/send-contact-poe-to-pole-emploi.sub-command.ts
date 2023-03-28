import { CommandRunner, SubCommand } from "nest-commander";

import { CommandLog } from "@gestion-des-contacts/src/infrastructure/configuration/log.decorator";

import { Usecase } from "@shared/src/application-service/usecase";

@SubCommand({ name: SendContactPoeToPoleEmploiSubCommand.CONTACT_NAME })
export class SendContactPoeToPoleEmploiSubCommand extends CommandRunner {
	private static readonly CONTACT_NAME = "poe";

	constructor(private readonly envoyerLesContactsPoeAPoleEmploi: Usecase) {
		super();
	}

	@CommandLog(SendContactPoeToPoleEmploiSubCommand.CONTACT_NAME)
	public async run(): Promise<void> {
		await this.envoyerLesContactsPoeAPoleEmploi.executer();
	}
}
