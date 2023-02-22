import axios from "axios";
import { Client } from "minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import {
	ConfigurationFactory,
	MinioConfiguration,
	StrapiConfiguration,
	TaskConfiguration,
} from "@evenements/src/chargement/configuration/configuration";
import { DateService } from "@shared/src/date.service";
import { Domaine, LogLevel } from "@shared/src/configuration/logger";
import { Environment, SentryConfiguration } from "@configuration/src/configuration";
import { EvenementsChargementLoggerStrategy } from "@evenements/src/chargement/configuration/logger-strategy";
import {
	FeatureFlippingEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/feature-flipping-evenements.repository";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import {
	MinioAndStrapiEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/minio-and-strapi-evenements.repository";
import { Shared } from "@shared/src";
import {
	StrapiEvenementHttpClient,
} from "@evenements/src/chargement/infrastructure/gateway/client/strapi-evenement-http-client";
import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.create] }),
		Shared,
	],
	providers: [{
		provide: EvenementsChargementLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): EvenementsChargementLoggerStrategy => {
			return new EvenementsChargementLoggerStrategy({
				MINIO: configurationService.get<MinioConfiguration>("MINIO"),
				TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
				STRAPI: configurationService.get<StrapiConfiguration>("STRAPI"),
				FEATURE_FLIPPING_CHARGEMENT: configurationService.get<boolean>("FEATURE_FLIPPING_CHARGEMENT"),
				CONTEXT: configurationService.get<string>("CONTEXT"),
				SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
				NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
				DOMAINE: configurationService.get<Domaine>("DOMAINE"),
				FLOWS: configurationService.get<Array<string>>("FLOWS"),
				TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
				LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
			});
		},
	}, {
		provide: "UnJeuneUneSolution.EvenementsRepository",
		inject: [
			ConfigService,
			EvenementsChargementLoggerStrategy,
			DateService,
			"FileSystemClient",
			JsonContentParser,
			"UuidGenerator",
		],
		useFactory: (
			configurationService: ConfigService,
			loggerStrategy: EvenementsChargementLoggerStrategy,
			dateService: DateService,
			fileSystemClient: FileSystemClient,
			contentParser: JsonContentParser,
			uuidGenerator: UuidGenerator,
		): UnJeuneUneSolution.EvenementsRepository => {
			console.log(fileSystemClient);
			const minioConfiguration = configurationService.get<MinioConfiguration>("MINIO");
			const strapiConfiguration = configurationService.get<StrapiConfiguration>("STRAPI");
			const minioClient = new Client({
				accessKey: minioConfiguration.ACCESS_KEY,
				secretKey: minioConfiguration.SECRET_KEY,
				port: minioConfiguration.PORT,
				endPoint: minioConfiguration.URL,
			});
			const axiosInstance = axios.create({
				baseURL: strapiConfiguration.BASE_URL,
				maxBodyLength: Infinity,
				maxContentLength: Infinity,
			});
			const authenticationClient = new AuthenticationClient(
				strapiConfiguration.AUTHENTICATION_URL,
				{
					username: strapiConfiguration.USERNAME,
					password: strapiConfiguration.PASSWORD,
				},
			);
			const strapiEvenementHttpClient = new StrapiEvenementHttpClient(
				axiosInstance,
				authenticationClient,
				strapiConfiguration.EVENEMENT_URL,
			);

			if (configurationService.get("FEATURE_FLIPPING_CHARGEMENT")) {
				return new FeatureFlippingEvenementsRepository(
					minioClient,
					strapiEvenementHttpClient,
					{
						MINIO: configurationService.get<MinioConfiguration>("MINIO"),
						TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
						STRAPI: configurationService.get<StrapiConfiguration>("STRAPI"),
						FEATURE_FLIPPING_CHARGEMENT: configurationService.get<boolean>("FEATURE_FLIPPING_CHARGEMENT"),
						CONTEXT: configurationService.get<string>("CONTEXT"),
						SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
						NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
						DOMAINE: configurationService.get<Domaine>("DOMAINE"),
						FLOWS: configurationService.get<Array<string>>("FLOWS"),
						TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
						LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
					},
					loggerStrategy,
					uuidGenerator,
					dateService,
				);
			} else {
				return new MinioAndStrapiEvenementsRepository(
					minioClient,
					strapiEvenementHttpClient,
					{
						MINIO: configurationService.get<MinioConfiguration>("MINIO"),
						TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
						STRAPI: configurationService.get<StrapiConfiguration>("STRAPI"),
						FEATURE_FLIPPING_CHARGEMENT: configurationService.get<boolean>("FEATURE_FLIPPING_CHARGEMENT"),
						CONTEXT: configurationService.get<string>("CONTEXT"),
						SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
						NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
						DOMAINE: configurationService.get<Domaine>("DOMAINE"),
						FLOWS: configurationService.get<Array<string>>("FLOWS"),
						TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
						LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
					},
					fileSystemClient,
					contentParser,
					loggerStrategy,
					uuidGenerator,
					dateService,
				);
			}
		},
	}],
	exports: [EvenementsChargementLoggerStrategy, "UnJeuneUneSolution.EvenementsRepository"],
})
export class Gateways {
}
