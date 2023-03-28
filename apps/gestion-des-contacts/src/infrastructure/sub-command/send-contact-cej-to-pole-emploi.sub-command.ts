import { CommandRunner, SubCommand } from "nest-commander";

import { CommandLog } from "@gestion-des-contacts/src/infrastructure/configuration/log.decorator";

import { Usecase } from "@shared/src/application-service/usecase";

@SubCommand({ name: SendContactCejToPoleEmploiSubCommand.CONTACT_NAME })
export class SendContactCejToPoleEmploiSubCommand extends CommandRunner {
	private static readonly CONTACT_NAME = "cej";

	constructor(private readonly envoyerLesContactsCejAPoleEmploi: Usecase) {
		super();
	}

	@CommandLog(SendContactCejToPoleEmploiSubCommand.CONTACT_NAME)
	public async run(): Promise<void> {
		await this.envoyerLesContactsCejAPoleEmploi.executer();
	}
}
