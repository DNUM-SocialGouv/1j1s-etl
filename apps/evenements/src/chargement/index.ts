import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@evenements/src/chargement/application-service";
import {
	ChargerFluxTousMobilises,
} from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import {
	Configuration,
	ConfigurationFactory,
} from "@evenements/src/chargement/infrastructure/configuration/configuration";
import {
	LoadFlowTousMobilisesSubCommand,
} from "@evenements/src/chargement/infrastructure/sub-command/load-flow-tous-mobilises.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: LoadFlowTousMobilisesSubCommand,
		inject: [ConfigService, ChargerFluxTousMobilises],
		useFactory: (configurationService: ConfigService, usecase: ChargerFluxTousMobilises): LoadFlowTousMobilisesSubCommand => {
			const configuration = configurationService.get<Configuration>("evenementsChargement");
			return new LoadFlowTousMobilisesSubCommand(usecase, configuration);
		},
	}],
	exports: [LoadFlowTousMobilisesSubCommand],
})
export class Chargement {
}
