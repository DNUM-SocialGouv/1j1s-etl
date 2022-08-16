import axios from "axios";
import { Client } from "minio";

import { Configuration } from "@configuration/configuration";
import { GatewayContainer } from "@chargement/infrastructure/gateway";
import { LoggerFactory } from "@shared/logger.factory";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { NodeFileSystemClient } from "@chargement/infrastructure/gateway/node-file-system.client";
import { NodeUuidGenerator } from "@chargement/infrastructure/gateway/uuid.generator";
import { StrapiOffreDeStageHttpClient } from "@chargement/infrastructure/gateway/http.client";

export class GatewayContainerFactory {
	static create(configuration: Configuration): GatewayContainer {
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO_ACCESS_KEY,
			secretKey: configuration.MINIO_SECRET_KEY,
			port: configuration.MINIO_PORT,
			endPoint: configuration.MINIO_URL,
		});
		const uuidClient = new NodeUuidGenerator();
		const axiosInstance = axios.create({
			baseURL: configuration.STRAPI_OFFRE_DE_STAGE_URL,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});
		const strapiOffreDeStageHttpClient = new StrapiOffreDeStageHttpClient(axiosInstance);
		const httpClientLogger = LoggerFactory.create(configuration);

		return {
			offreDeStageRepository: new MinioHttpOffreDeStageRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidClient,
				strapiOffreDeStageHttpClient,
				httpClientLogger,
			),
		};
	}
}