import { CommandRunner, SubCommand } from "nest-commander";

import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";

@SubCommand({
	name: "les-offres-de-stage",
})
export class PurgeInternshipsSubCommand extends CommandRunner {
	constructor(private readonly purgerLesOffresDeStage: PurgerLesOffresDeStage) {
		super();
	}

	public override async run(): Promise<void> {
		await this.purgerLesOffresDeStage.executer([]);
	}
}
