import axios from "axios";
import { Client } from "minio";

import { AnnonceDeLogementRepository } from "@logements/chargement/domain/annonce-de-logement.repository";
import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import { Configuration } from "@logements/chargement/configuration/configuration";
import { DateService } from "@shared/date.service";
import {
	FeatureFlippingAnnonceDeLogementRepository,
} from "@logements/chargement/infrastructure/gateway/repository/feature-flipping-annonce-de-logement.repository";
import { GatewayContainer } from "@logements/chargement/infrastructure/gateway";
import { HttpClient, StrapiClient } from "@logements/chargement/infrastructure/gateway/client/http.client";
import { LoggerStrategy } from "@shared/configuration/logger";
import {
	MinioHttpAnnonceDeLogementRepository,
} from "@logements/chargement/infrastructure/gateway/repository/minio-http-annonce-de-logement.repository";
import { MinioStorageClient, StorageClient } from "@logements/chargement/infrastructure/gateway/client/storage.client";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";


export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: LoggerStrategy): GatewayContainer {
		const dateService = new DateService();
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const uuidClient = new NodeUuidGenerator();
		const axiosInstance = axios.create({
			baseURL: configuration.STRAPI.BASE_URL,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});

		const strapiCredentials = {
			username: configuration.STRAPI.USERNAME,
			password: configuration.STRAPI.PASSWORD,
		};

		const authClient = new AuthenticationClient(configuration.STRAPI.AUTHENTICATION_URL, strapiCredentials);

		const storageClient = new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidClient);
		const httpClient = new StrapiClient(axiosInstance, configuration.STRAPI.HOUSING_URL, authClient);

		return {
			annonceDeLogementRepository: GatewayContainerFactory.buildAnnonceDeLogementRepository(
				configuration,
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			),
		};
	}

	private static buildAnnonceDeLogementRepository(
		configuration: Configuration,
		storageClient: StorageClient,
		httpClient: HttpClient,
		dateService: DateService,
		loggerStrategy: LoggerStrategy,
	): AnnonceDeLogementRepository {
		if (configuration.FEATURE_FLIPPING) {
			return new FeatureFlippingAnnonceDeLogementRepository(
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			);
		} else {
			return new MinioHttpAnnonceDeLogementRepository(
				storageClient,
				httpClient,
				dateService,
				loggerStrategy,
			);
		}
	}

}