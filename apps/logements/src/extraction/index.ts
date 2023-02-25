import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@logements/src/extraction/application-service";
import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import { Configuration, ConfigurationFactory } from "@logements/src/extraction/configuration/configuration";
import { ExtractFlowImmojeuneTask } from "@logements/src/extraction/infrastructure/tasks/extract-flow-immojeune.task";
import { ExtractFlowStudapartTask } from "@logements/src/extraction/infrastructure/tasks/extract-flow-studapart.task";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
		Usecases,
	],
	providers: [{
		provide: ExtractFlowImmojeuneTask,
		inject: [ConfigService, ExtraireImmojeune],
		useFactory: (
			configurationService: ConfigService,
			extraireImmojeune: ExtraireImmojeune,
		): ExtractFlowImmojeuneTask => {
			return new ExtractFlowImmojeuneTask(extraireImmojeune, configurationService.get<Configuration>("extractionLogements"));
		},
	}, {
		provide: ExtractFlowStudapartTask,
		inject: [ConfigService, ExtraireStudapart],
		useFactory: (
			configurationService: ConfigService,
			extraireStudapart: ExtraireStudapart,
		): ExtractFlowStudapartTask => {
			return new ExtractFlowStudapartTask(extraireStudapart, configurationService.get<Configuration>("extractionLogements"));
		},
	}],
	exports: [ExtractFlowImmojeuneTask, ExtractFlowStudapartTask],
})
export class Extraction {
}
