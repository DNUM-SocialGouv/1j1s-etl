import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";
import {
	ConfigurationFactory,
	MaintenanceLoggerConfiguration,
	StrapiConfiguration,
} from "@maintenance/src/infrastructure/configuration/configuration";
import {
	HttpInternshipRepository,
} from "@maintenance/src/infrastructure/gateway/repository/http-internship.repository";

import { Shared } from "@shared/src";
import { SentryConfiguration } from "@shared/src/infrastructure/configuration/configuration";
import { Logger, LoggerFactory } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

@Module({
	imports: [Shared, ConfigModule.forRoot({ load: [ConfigurationFactory.create] })],
	providers: [
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
			provide: "OffreDeStageRepository",
			inject: [ConfigService, StrapiHttpClient, "Logger"],
			useFactory: (configurationService: ConfigService, strapiHttpClient: StrapiHttpClient, logger: Logger): OffreDeStageRepository => {
				const strapiConfiguration = configurationService.get<StrapiConfiguration>("STRAPI");
				return new HttpInternshipRepository(strapiConfiguration, strapiHttpClient, logger);
			},
		},
	],
	exports: ["OffreDeStageRepository"],
})
export class Gateways {

}
