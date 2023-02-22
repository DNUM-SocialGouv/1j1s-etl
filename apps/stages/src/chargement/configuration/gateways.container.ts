import axios from "axios";
import { Client } from "minio";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { Configuration } from "@stages/src/chargement/configuration/configuration";
import { GatewayContainer } from "@stages/src/chargement/infrastructure/gateway";
import {
	FeatureFlippingOffreDeStageRepository,
} from "@stages/src/chargement/infrastructure/gateway/repository/feature-flipping-offre-de-stage.repository";
import { FileSystemClient, NodeFileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { StagesChargementLoggerStrategy } from "@stages/src/chargement/configuration/logger-strategy";
import {
	MinioHttpOffreDeStageRepository,
} from "@stages/src/chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { NodeUuidGenerator, UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import { StrapiOffreDeStageHttpClient } from "@stages/src/chargement/infrastructure/gateway/client/http.client";
import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: StagesChargementLoggerStrategy): GatewayContainer {
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
		loggerStrategy: StagesChargementLoggerStrategy,
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
