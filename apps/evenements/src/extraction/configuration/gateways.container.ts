import axios from "axios";
import { Client } from "minio";

import { Configuration } from "@evenements/src/extraction/configuration/configuration";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import { NodeFileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import { GatewayContainer } from "@evenements/src/extraction/infrastructure/gateway";
import {
	MinioHttpFlowRepository,
} from "@evenements/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import {
	TousMobilisesBasicFlowHttpClient,
} from "@evenements/src/extraction/infrastructure/gateway/client/tous-mobilises-basic-flow-http.client";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: LoggerStrategy): GatewayContainer {
		const httpClient = axios.create({
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});

		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const uuidGenerator = new NodeUuidGenerator();

		const eventsBasicFlowHttpClient = new TousMobilisesBasicFlowHttpClient(httpClient, configuration);

		return {
			repositories: {
				flowRepository: new MinioHttpFlowRepository(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator,
					eventsBasicFlowHttpClient,
					loggerStrategy
				),
			},
		};
	}
}
