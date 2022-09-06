import axios from "axios";
import { Client } from "minio";

import { AuthenticationClient } from "@chargement/infrastructure/gateway/authentication.client";
import { Configuration } from "@chargement/configuration/configuration";
import { GatewayContainer } from "@chargement/infrastructure/gateway";
import {
	FeatureFlippingOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/feature-flipping-offre-de-stage.repository";
import { FileSystemClient, NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { LoggerStrategy } from "@chargement/configuration/logger-strategy";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { NodeUuidGenerator, UuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";
import { StrapiOffreDeStageHttpClient } from "@chargement/infrastructure/gateway/http.client";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: LoggerStrategy): GatewayContainer {
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const uuidGenerator = new NodeUuidGenerator();
		const axiosInstance = axios.create({
			baseURL: configuration.STRAPI.BASE_URL,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});
		const authenticationClient = new AuthenticationClient(
			configuration.STRAPI.AUTHENTICATION_URL,
			{ username: configuration.STRAPI.USERNAME, password: configuration.STRAPI.PASSWORD },
		);
		const strapiOffreDeStageHttpClient = new StrapiOffreDeStageHttpClient(
			axiosInstance,
			authenticationClient,
			configuration.STRAPI.OFFRE_DE_STAGE_URL
		);

		return {
			offreDeStageRepository: this.buildOffreDeStageRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				strapiOffreDeStageHttpClient,
				loggerStrategy
			),
		};
	}

	public static buildOffreDeStageRepository(
		configuration: Configuration,
		minioClient: Client,
		fileSystemClient: FileSystemClient,
		uuidGenerator: UuidGenerator,
		offreDeStageHttpClient: StrapiOffreDeStageHttpClient,
		loggerStrategy: LoggerStrategy,
	): UnJeune1Solution.OffreDeStageRepository {
		if (configuration.FEATURE_FLIPPING_CHARGEMENT) {
			return new FeatureFlippingOffreDeStageRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				offreDeStageHttpClient,
				loggerStrategy
			);
		} else {
			return new MinioHttpOffreDeStageRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				offreDeStageHttpClient,
				loggerStrategy,
			);
		}
	}
}
