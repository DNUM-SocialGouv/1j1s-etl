import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@maintenance/src/application-service";
import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { Configuration, ConfigurationFactory } from "@maintenance/src/infrastructure/configuration/configuration";
import { PurgeHousingAdsSubCommand } from "@maintenance/src/infrastructure/sub-command/purge-housing-ads.sub-command";
import { PurgeInternshipsSubCommand } from "@maintenance/src/infrastructure/sub-command/purge-internships.sub-command";

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
			provide: PurgeInternshipsSubCommand,
			inject: [ConfigService, PurgerLesOffresDeStage],
			useFactory: (configurationService: ConfigService, purgerLesOffresDeStage: PurgerLesOffresDeStage): PurgeInternshipsSubCommand => {
				const configuration = configurationService.get<Configuration>("maintenance");
				return new PurgeInternshipsSubCommand(purgerLesOffresDeStage, configuration);
			},
		},
		{
			provide: PurgeHousingAdsSubCommand,
			inject: [ConfigService, PurgerLesAnnoncesDeLogement],
			useFactory: (configurationService: ConfigService, purgerLesAnnoncesDeLogement: PurgerLesAnnoncesDeLogement): PurgeHousingAdsSubCommand => {
				const configuration = configurationService.get<Configuration>("maintenance");
				return new PurgeHousingAdsSubCommand(purgerLesAnnoncesDeLogement, configuration);
			},
		},
	],
	exports: [PurgeHousingAdsSubCommand, PurgeInternshipsSubCommand],
})
export class Maintenance {
}
