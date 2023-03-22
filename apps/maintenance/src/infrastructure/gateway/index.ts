import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Client } from "minio";

import { AnnonceDeLogementRepository } from "@maintenance/src/domain/service/annonce-de-logement.repository";
import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";
import {
	ConfigurationFactory,
	MaintenanceLoggerConfiguration,
	StrapiConfiguration,
} from "@maintenance/src/infrastructure/configuration/configuration";
import {
	HttpHousingAdsRepository,
} from "@maintenance/src/infrastructure/gateway/repository/http-housing-ads.repository";
import {
	HttpInternshipRepository,
} from "@maintenance/src/infrastructure/gateway/repository/http-internship.repository";
import {
	MinioAdminStorageRepository,
} from "@maintenance/src/infrastructure/gateway/repository/minio-admin-storage.repository";

import { Shared } from "@shared/src";
import { SentryConfiguration } from "@shared/src/infrastructure/configuration/configuration";
import { Logger, LoggerFactory } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.create],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Shared,
	],
	providers: [
		{
			provide: MinioAdminStorageRepository,
			inject: [Client],
			useFactory: (minioClient: Client): MinioAdminStorageRepository => {
				return new MinioAdminStorageRepository(minioClient);
			},
		},
		{
			provide: "Logger",
			inject: [ConfigService],
			useFactory: (configurationService: ConfigService): Logger => {
				const loggerConfiguration = configurationService.get<MaintenanceLoggerConfiguration>("LOGGER");
				const sentryConfiguration = configurationService.get<SentryConfiguration>("SENTRY");
				const loggerFactory = new LoggerFactory(
					sentryConfiguration.DSN,
					sentryConfiguration.PROJECT,
					sentryConfiguration.RELEASE,
					loggerConfiguration.ENVIRONMENT,
					loggerConfiguration.CONTEXT,
					loggerConfiguration.LOG_LEVEL,
					loggerConfiguration.DOMAINE,
				);
				return loggerFactory.create({ name: loggerConfiguration.NAME });
			},
		},
		{
			provide: "AnnonceDeLogementRepository",
			inject: [ConfigService, StrapiHttpClient, "Logger"],
			useFactory: (configurationService: ConfigService, strapiHttpClient: StrapiHttpClient, logger: Logger): AnnonceDeLogementRepository => {
				const strapiConfiguration = configurationService.get<StrapiConfiguration>("STRAPI");
				return new HttpHousingAdsRepository(strapiHttpClient, strapiConfiguration, logger);
			},
		},
		{
			provide: "OffreDeStageRepository",
			inject: [ConfigService, StrapiHttpClient, "Logger"],
			useFactory: (configurationService: ConfigService, strapiHttpClient: StrapiHttpClient, logger: Logger): OffreDeStageRepository => {
				const strapiConfiguration = configurationService.get<StrapiConfiguration>("STRAPI");
				return new HttpInternshipRepository(strapiConfiguration, strapiHttpClient, logger);
			},
		},
	],
	exports: ["AnnonceDeLogementRepository", "OffreDeStageRepository", MinioAdminStorageRepository],
})
export class Gateways {
}
