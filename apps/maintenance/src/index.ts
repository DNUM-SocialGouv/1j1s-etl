import { Module } from "@nestjs/common";

import { Usecases } from "@maintenance/src/application-service";
import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { PurgeInternshipsSubCommand } from "@maintenance/src/infrastructure/sub-command/purge-internships.sub-command";

@Module({
	imports: [Usecases],
	exports: [PurgeInternshipsSubCommand],
	providers: [{
		provide: PurgeInternshipsSubCommand,
		inject: [PurgerLesOffresDeStage],
		useFactory: (purgerLesOffresDeStage: PurgerLesOffresDeStage) : PurgeInternshipsSubCommand => {
			return new PurgeInternshipsSubCommand(purgerLesOffresDeStage);
		},
	}],
})
export class Maintenance {
}
