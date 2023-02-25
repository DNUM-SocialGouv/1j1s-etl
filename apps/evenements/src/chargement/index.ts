import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import {
	ChargerFluxTousMobilises,
} from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { Configuration, ConfigurationFactory } from "@evenements/src/chargement/configuration/configuration";
import { Usecases } from "@evenements/src/chargement/configuration/usecases.container";
import { LoadTousMobilisesTask } from "@evenements/src/chargement/infrastructure/tasks/load-tous-mobilises.task";

@Module({
	imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }), Usecases],
	providers: [{
		provide: LoadTousMobilisesTask,
		inject: [ConfigService, ChargerFluxTousMobilises],
		useFactory: (configurationService: ConfigService, usecase: ChargerFluxTousMobilises): LoadTousMobilisesTask => {
			const configuration = configurationService.get<Configuration>("evenementsChargement");
			return new LoadTousMobilisesTask(usecase, configuration);
		},
	}],
	exports: [LoadTousMobilisesTask],
})
export class Chargement {
}
