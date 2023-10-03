import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@stages/src/chargement/application-service";
import { ChargerFluxHellowork } from "@stages/src/chargement/application-service/charger-flux-hellowork.usecase";
import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import {
	ChargerFluxStagefrCompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import {
	ChargerFluxStagefrDecompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { Configuration, ConfigurationFactory } from "@stages/src/chargement/infrastructure/configuration/configuration";
import {
	LoadFlowHelloworkSubCommand,
} from "@stages/src/chargement/infrastructure/sub-command/load-flow-hellowork.sub-command";
import { LoadFlowJobteaserSubCommand } from "@stages/src/chargement/infrastructure/sub-command/load-flow-jobteaser.sub-command";
import {
	LoadFlowStagefrCompressedSubCommand,
} from "@stages/src/chargement/infrastructure/sub-command/load-flow-stagefr-compressed.sub-command";
import {
	LoadFlowStagefrUncompressedSubCommand,
} from "@stages/src/chargement/infrastructure/sub-command/load-flow-stagefr-uncompressed.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [
	{
		provide: LoadFlowHelloworkSubCommand,
		inject: [ConfigService, ChargerFluxHellowork],
		useFactory: (configurationService: ConfigService, chargerFluxHellowork: ChargerFluxHellowork): LoadFlowHelloworkSubCommand => {
			return new LoadFlowHelloworkSubCommand(chargerFluxHellowork, configurationService.get<Configuration>("stagesChargement"));
		},
	},
	{
		provide: LoadFlowJobteaserSubCommand,
		inject: [ConfigService, ChargerFluxJobteaser],
		useFactory: (configurationService: ConfigService, chargerFluxJobteaser: ChargerFluxJobteaser): LoadFlowJobteaserSubCommand => {
			return new LoadFlowJobteaserSubCommand(chargerFluxJobteaser, configurationService.get<Configuration>("stagesChargement"));
		},
	}, {
		provide: LoadFlowStagefrCompressedSubCommand,
		inject: [ConfigService, ChargerFluxStagefrCompresse],
		useFactory: (configurationService: ConfigService, chargerFluxStagefrCompresse: ChargerFluxStagefrCompresse): LoadFlowStagefrCompressedSubCommand => {
			return new LoadFlowStagefrCompressedSubCommand(chargerFluxStagefrCompresse, configurationService.get<Configuration>("stagesChargement"));
		},
	}, {
		provide: LoadFlowStagefrUncompressedSubCommand,
		inject: [ConfigService, ChargerFluxStagefrDecompresse],
		useFactory: (configurationService: ConfigService, chargerFluxStagefrCompresse: ChargerFluxStagefrDecompresse): LoadFlowStagefrUncompressedSubCommand => {
			return new LoadFlowStagefrUncompressedSubCommand(chargerFluxStagefrCompresse, configurationService.get<Configuration>("stagesChargement"));
		},
	}],
	exports: [
		LoadFlowHelloworkSubCommand,
		LoadFlowJobteaserSubCommand,
		LoadFlowStagefrCompressedSubCommand,
		LoadFlowStagefrUncompressedSubCommand,
	],
})
export class Chargement {
}
