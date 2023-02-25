import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@stages/src/chargement/application-service";
import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import {
	ChargerFluxStagefrCompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import {
	ChargerFluxStagefrDecompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { Configuration, ConfigurationFactory } from "@stages/src/chargement/configuration/configuration";
import { LoadJobteaserTask } from "@stages/src/chargement/infrastructure/tasks/load-jobteaser.task";
import { LoadStagefrCompressedTask } from "@stages/src/chargement/infrastructure/tasks/load-stagefr-compressed.task";
import {
	LoadStagefrUncompressedTask,
} from "@stages/src/chargement/infrastructure/tasks/load-stagefr-uncompressed.task";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
		Usecases,
	],
	providers: [{
		provide: LoadJobteaserTask,
		inject: [ConfigService, ChargerFluxJobteaser],
		useFactory: (configurationService: ConfigService, chargerFluxJobteaser: ChargerFluxJobteaser): LoadJobteaserTask => {
			return new LoadJobteaserTask(chargerFluxJobteaser, configurationService.get<Configuration>("stagesChargement"));
		},
	}, {
		provide: LoadStagefrCompressedTask,
		inject: [ConfigService, ChargerFluxStagefrCompresse],
		useFactory: (configurationService: ConfigService, chargerFluxStagefrCompresse: ChargerFluxStagefrCompresse): LoadStagefrCompressedTask => {
			return new LoadStagefrCompressedTask(chargerFluxStagefrCompresse, configurationService.get<Configuration>("stagesChargement"));
		},
	}, {
		provide: LoadStagefrUncompressedTask,
		inject: [ConfigService, ChargerFluxStagefrDecompresse],
		useFactory: (configurationService: ConfigService, chargerFluxStagefrCompresse: ChargerFluxStagefrDecompresse): LoadStagefrUncompressedTask => {
			return new LoadStagefrUncompressedTask(chargerFluxStagefrCompresse, configurationService.get<Configuration>("stagesChargement"));
		},
	}],
	exports: [
		LoadJobteaserTask,
		LoadStagefrCompressedTask,
		LoadStagefrUncompressedTask,
	],
})
export class Chargement {
}
