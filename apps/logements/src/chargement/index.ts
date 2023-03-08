import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@logements/src/chargement/application-service";
import { ChargerFluxImmojeune } from "@logements/src/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/src/chargement/application-service/charger-flux-studapart.usecase";
import {
	Configuration,
	ConfigurationFactory,
} from "@logements/src/chargement/infrastructure/configuration/configuration";
import { LoadFlowImmojeuneSubCommand } from "@logements/src/chargement/infrastructure/sub-command/load-flow-immojeune.sub-command";
import { LoadFlowStudapartSubCommand } from "@logements/src/chargement/infrastructure/sub-command/load-flow-studapart.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: LoadFlowImmojeuneSubCommand,
		inject: [ConfigService, ChargerFluxImmojeune],
		useFactory: (
			configurationService: ConfigService,
			chargerFluxImmojeune: ChargerFluxImmojeune,
		): LoadFlowImmojeuneSubCommand => {
			return new LoadFlowImmojeuneSubCommand(chargerFluxImmojeune, configurationService.get<Configuration>("chargementLogements"));
		},
	}, {
		provide: LoadFlowStudapartSubCommand,
		inject: [ConfigService, ChargerFluxStudapart],
		useFactory: (
			configurationService: ConfigService,
			chargerFluxStudapart: ChargerFluxStudapart,
		): LoadFlowStudapartSubCommand => {
			return new LoadFlowStudapartSubCommand(chargerFluxStudapart, configurationService.get<Configuration>("chargementLogements"));
		},
	}],
	exports: [LoadFlowImmojeuneSubCommand, LoadFlowStudapartSubCommand],
})
export class Chargement {
}
