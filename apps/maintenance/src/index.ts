import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@maintenance/src/application-service";
import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { Configuration, ConfigurationFactory } from "@maintenance/src/infrastructure/configuration/configuration";
import { PurgeHousingAdsTask } from "@maintenance/src/infrastructure/task/purge-housing-ads.task";
import { PurgeInternshipsTask } from "@maintenance/src/infrastructure/task/purge-internships.task";

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
			provide: PurgeInternshipsTask,
			inject: [ConfigService, PurgerLesOffresDeStage],
			useFactory: (configurationService: ConfigService, purgerLesOffresDeStage: PurgerLesOffresDeStage): PurgeInternshipsTask => {
				const configuration = configurationService.get<Configuration>("maintenance");
				return new PurgeInternshipsTask(purgerLesOffresDeStage, configuration);
			},
		},
		{
			provide: PurgeHousingAdsTask,
			inject: [ConfigService, PurgerLesAnnoncesDeLogement],
			useFactory: (configurationService: ConfigService, purgerLesAnnoncesDeLogement: PurgerLesAnnoncesDeLogement): PurgeHousingAdsTask => {
				const configuration = configurationService.get<Configuration>("maintenance");
				return new PurgeHousingAdsTask(purgerLesAnnoncesDeLogement, configuration);
			},
		},
	],
	exports: [PurgeHousingAdsTask, PurgeInternshipsTask],
})
export class Maintenance {
}
