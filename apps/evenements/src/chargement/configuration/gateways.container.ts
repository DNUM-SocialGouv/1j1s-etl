import { Environment, SentryConfiguration } from "@configuration/src/configuration";
import {
	MinioConfiguration,
	StrapiConfiguration,
	TaskConfiguration,
} from "@evenements/src/chargement/configuration/configuration";
import { EvenementsChargementLoggerStrategy } from "@evenements/src/chargement/configuration/logger-strategy";
import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import {
	StrapiEvenementHttpClient,
} from "@evenements/src/chargement/infrastructure/gateway/client/strapi-evenement-http-client";
import {
	FeatureFlippingEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/feature-flipping-evenements.repository";
import {
	MinioAndStrapiEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/minio-and-strapi-evenements.repository";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SharedModule } from "@shared/src";
import { Domaine, LogLevel } from "@shared/src/configuration/logger";
import { DateService } from "@shared/src/date.service";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { NodeFileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import axios from "axios";
import { Client } from "minio";

@Module({
	imports: [SharedModule, ConfigModule],
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
		inject: [ConfigService, EvenementsChargementLoggerStrategy],
		useFactory: (configurationService: ConfigService, loggerStrategy: EvenementsChargementLoggerStrategy): UnJeuneUneSolution.EvenementsRepository => {
			const minioConfiguration = configurationService.get<MinioConfiguration>("MINIO");
			const strapiConfiguration = configurationService.get<StrapiConfiguration>("STRAPI");
			const minioClient = new Client({
				accessKey: minioConfiguration.ACCESS_KEY,
				secretKey: minioConfiguration.SECRET_KEY,
				port: minioConfiguration.PORT,
				endPoint: minioConfiguration.URL,
			});
			const uuidGenerator = new NodeUuidGenerator();
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
					new DateService(),
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
					new NodeFileSystemClient(configurationService.get("TEMPORARY_DIRECTORY_PATH")),
					new JsonContentParser(),
					loggerStrategy,
					uuidGenerator,
					new DateService(),
				);
			}
		},
	}],
	exports: [EvenementsChargementLoggerStrategy, "UnJeuneUneSolution.EvenementsRepository"],
})
export class Gateways {
}
