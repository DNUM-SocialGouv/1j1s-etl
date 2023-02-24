import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ChargerFluxImmojeune } from "@logements/src/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/src/chargement/application-service/charger-flux-studapart.usecase";
import { Configuration, ConfigurationFactory } from "@logements/src/chargement/configuration/configuration";
import { Usecases } from "@logements/src/chargement/configuration/usecase.container";
import { LoadImmojeuneTask } from "@logements/src/chargement/infrastructure/tasks/load-immojeune.task";
import { LoadStudapartTask } from "@logements/src/chargement/infrastructure/tasks/load-studapart.task";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
		Usecases,
	],
	providers: [{
		provide: LoadImmojeuneTask,
		inject: [ConfigService, ChargerFluxImmojeune],
		useFactory: (
			configurationService: ConfigService,
			chargerFluxImmojeune: ChargerFluxImmojeune,
		): LoadImmojeuneTask => {
			return new LoadImmojeuneTask(chargerFluxImmojeune, configurationService.get<Configuration>("chargementLogements"));
		},
	}, {
		provide: LoadStudapartTask,
		inject: [ConfigService, ChargerFluxStudapart],
		useFactory: (
			configurationService: ConfigService,
			chargerFluxStudapart: ChargerFluxStudapart,
		): LoadStudapartTask => {
			return new LoadStudapartTask(chargerFluxStudapart, configurationService.get<Configuration>("chargementLogements"));
		},
	}],
	exports: [LoadImmojeuneTask, LoadStudapartTask],
})
export class Chargement {
}
