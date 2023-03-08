import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@logements/src/extraction/application-service";
import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import {
	Configuration,
	ConfigurationFactory,
} from "@logements/src/extraction/infrastructure/configuration/configuration";
import {
	ExtractFlowImmojeuneSubCommand,
} from "@logements/src/extraction/infrastructure/sub-command/extract-flow-immojeune.sub-command";
import {
	ExtractFlowStudapartSubCommand,
} from "@logements/src/extraction/infrastructure/sub-command/extract-flow-studapart.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: ExtractFlowImmojeuneSubCommand,
		inject: [ConfigService, ExtraireImmojeune],
		useFactory: (
			configurationService: ConfigService,
			extraireImmojeune: ExtraireImmojeune,
		): ExtractFlowImmojeuneSubCommand => {
			return new ExtractFlowImmojeuneSubCommand(extraireImmojeune, configurationService.get<Configuration>("extractionLogements"));
		},
	}, {
		provide: ExtractFlowStudapartSubCommand,
		inject: [ConfigService, ExtraireStudapart],
		useFactory: (
			configurationService: ConfigService,
			extraireStudapart: ExtraireStudapart,
		): ExtractFlowStudapartSubCommand => {
			return new ExtractFlowStudapartSubCommand(extraireStudapart, configurationService.get<Configuration>("extractionLogements"));
		},
	}],
	exports: [ExtractFlowImmojeuneSubCommand, ExtractFlowStudapartSubCommand],
})
export class Extraction {
}
