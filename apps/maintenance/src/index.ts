import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@maintenance/src/application-service";
import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { CreateMinioBucketCommand } from "@maintenance/src/infrastructure/command/create-minio-bucket.command";
import { Configuration, ConfigurationFactory } from "@maintenance/src/infrastructure/configuration/configuration";
import { Gateways } from "@maintenance/src/infrastructure/gateway";
import {
	MinioAdminStorageRepository,
} from "@maintenance/src/infrastructure/gateway/repository/minio-admin-storage.repository";
import { PurgeHousingAdsSubCommand } from "@maintenance/src/infrastructure/sub-command/purge-housing-ads.sub-command";
import { PurgeInternshipsSubCommand } from "@maintenance/src/infrastructure/sub-command/purge-internships.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Gateways,
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
		{
			provide: CreateMinioBucketCommand,
			inject: [MinioAdminStorageRepository],
			useFactory: (minioAdminStorageClient: MinioAdminStorageRepository): CreateMinioBucketCommand => {
				return new CreateMinioBucketCommand(minioAdminStorageClient);
			},
		},
	],
	exports: [
		CreateMinioBucketCommand,
		PurgeHousingAdsSubCommand,
		PurgeInternshipsSubCommand,
	],
})
export class Maintenance {
}
