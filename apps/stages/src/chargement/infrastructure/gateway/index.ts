import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";

import { Shared } from "@shared/src";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

import { Configuration, ConfigurationFactory } from "@stages/src/chargement/configuration/configuration";
import { StagesChargementLoggerStrategy } from "@stages/src/chargement/configuration/logger-strategy";
import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";
import {
	HttpClient,
	StrapiOffreDeStageHttpClient,
} from "@stages/src/chargement/infrastructure/gateway/client/http.client";
import {
	FeatureFlippingOffreDeStageRepository,
} from "@stages/src/chargement/infrastructure/gateway/repository/feature-flipping-offre-de-stage.repository";
import {
	MinioHttpOffreDeStageRepository,
} from "@stages/src/chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
		Shared,
	],
	providers: [{
		provide: AuthenticationClient,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): AuthenticationClient => {
			const configuration = configurationService.get<Configuration>("stagesChargement");
			return new AuthenticationClient(
				configuration.STRAPI.AUTHENTICATION_URL,
				{ username: configuration.STRAPI.USERNAME, password: configuration.STRAPI.PASSWORD },
			);
		},
	}, {
		provide: "HttpClient",
		inject: [ConfigService, AuthenticationClient],
		useFactory: (configurationService: ConfigService, authenticationClient: AuthenticationClient): HttpClient => {
			const configuration = configurationService.get<Configuration>("stagesChargement");
			const axiosInstance = axios.create({
				baseURL: configuration.STRAPI.BASE_URL,
			});
			return new StrapiOffreDeStageHttpClient(axiosInstance, authenticationClient, configuration.STRAPI.OFFRE_DE_STAGE_URL);
		},
	}, {
		provide: StagesChargementLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): LoggerStrategy => {
			return new StagesChargementLoggerStrategy(configurationService.get<Configuration>("stagesChargement"));
		},
	}, {
		provide: "UnJeune1Solution.Repository",
		inject: [
			ConfigService,
			AuthenticationClient,
			Client,
			"FileSystemClient",
			"UuidGenerator",
			"HttpClient",
			StagesChargementLoggerStrategy,
		],
		useFactory: (
			configurationService: ConfigService,
			authenticationClient: AuthenticationClient,
			minioClient: Client,
			fileSystemClient: FileSystemClient,
			uuidGenerator: UuidGenerator,
			strapiOffreDeStageHttpClient: HttpClient,
			loggerStrategy: StagesChargementLoggerStrategy,
		): UnJeune1Solution.OffreDeStageRepository => {
			const configuration = configurationService.get<Configuration>("stagesChargement");
			if (configuration.FEATURE_FLIPPING_CHARGEMENT) {
				return new FeatureFlippingOffreDeStageRepository(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator,
					strapiOffreDeStageHttpClient,
					loggerStrategy,
				);
			} else {
				return new MinioHttpOffreDeStageRepository(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator,
					strapiOffreDeStageHttpClient,
					loggerStrategy,
				);
			}
		},
	}],
	exports: ["UnJeune1Solution.Repository"],
})
export class Gateways {
}
