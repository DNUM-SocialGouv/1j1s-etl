import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";

import { AnnonceDeLogementRepository } from "@logements/src/chargement/domain/service/annonce-de-logement.repository";
import {
	Configuration,
	ConfigurationFactory,
} from "@logements/src/chargement/infrastructure/configuration/configuration";
import { LogementsChargementLoggerStrategy } from "@logements/src/chargement/infrastructure/configuration/logger-strategy";
import { StrapiClient } from "@logements/src/chargement/infrastructure/gateway/client/http.client";
import {
	MinioStorageClient,
	StorageClient,
} from "@logements/src/chargement/infrastructure/gateway/client/storage.client";
import {
	FeatureFlippingAnnonceDeLogementRepository,
} from "@logements/src/chargement/infrastructure/gateway/repository/feature-flipping-annonce-de-logement.repository";
import {
	MinioHttpAnnonceDeLogementRepository,
} from "@logements/src/chargement/infrastructure/gateway/repository/minio-http-annonce-de-logement.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
		Shared,
	],
	providers: [{
		provide: "LoggerStrategy",
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): LoggerStrategy => {
			return new LogementsChargementLoggerStrategy(configurationService.get<Configuration>("chargementLogements"));
		},
	}, {
		provide: "StorageClient",
		inject: [ConfigService, "FileSystemClient", Client, "UuidGenerator"],
		useFactory: (
			configurationService: ConfigService,
			fileSystemClient: FileSystemClient,
			minioClient: Client,
			uuidGenerator: UuidGenerator,
		): StorageClient => {
			const configuration = configurationService.get<Configuration>("chargementLogements");
			return new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidGenerator);
		},
	}, {
		provide: AuthenticationClient,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): AuthenticationClient => {
			const configuration = configurationService.get<Configuration>("chargementLogements");
			const strapiCredentials = {
				password: configuration.STRAPI.PASSWORD,
				username: configuration.STRAPI.USERNAME,
			};
			return new AuthenticationClient(configuration.STRAPI.AUTHENTICATION_URL, strapiCredentials);
		},
	}, {
		provide: StrapiClient,
		inject: [ConfigService, AuthenticationClient],
		useFactory: (configurationService: ConfigService, authenticationClient: AuthenticationClient): StrapiClient => {
			const configuration = configurationService.get<Configuration>("chargementLogements");
			const axiosInstance = axios.create({
				baseURL: configuration.STRAPI.BASE_URL,
				maxBodyLength: Infinity,
				maxContentLength: Infinity,
			});
			return new StrapiClient(axiosInstance, configuration.STRAPI.HOUSING_URL, authenticationClient);
		},
	}, {
		provide: "AnnonceDeLogementRepository",
		inject: [ConfigService, "StorageClient", StrapiClient, DateService, "LoggerStrategy"],
		useFactory: (
			configurationService: ConfigService,
			storageClient: StorageClient,
			strapiClient: StrapiClient,
			dateService: DateService,
			loggerStrategy: LoggerStrategy,
		): AnnonceDeLogementRepository => {
			const configuration = configurationService.get<Configuration>("chargementLogements");

			if (configuration.FEATURE_FLIPPING) {
				return new FeatureFlippingAnnonceDeLogementRepository(
					storageClient,
					strapiClient,
					dateService,
					loggerStrategy,
				);
			} else {
				return new MinioHttpAnnonceDeLogementRepository(
					storageClient,
					strapiClient,
					dateService,
					loggerStrategy,
				);
			}
		},
	}],
	exports: ["AnnonceDeLogementRepository"],
})
export class Gateways {
}
