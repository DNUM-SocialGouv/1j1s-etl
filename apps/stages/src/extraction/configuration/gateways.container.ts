import axios from "axios";
import { Client } from "minio";

import { LoggerStrategy } from "@shared/src/configuration/logger";
import { BasicFlowHttpClient } from "@shared/src/infrastructure/gateway/client/basic-flow-http.client";
import { CompressedFlowHttpClient } from "@shared/src/infrastructure/gateway/client/compressed-flow-http.client";
import { OctetStreamFlowHttpClient } from "@shared/src/infrastructure/gateway/client/octet-stream-flow-http.client";
import { NodeFileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@shared/src/infrastructure/gateway/unzip.client";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

import { Configuration } from "@stages/src/extraction/configuration/configuration";
import { GatewayContainer } from "@stages/src/extraction/infrastructure/gateway";
import { StagesOnFlowNameStrategy } from "@stages/src/extraction/infrastructure/gateway/client/flow.strategy";
import { MinioHttpFlowRepository } from "@stages/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

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
		const unzipClient = new UnzipClient();
		const octetStreamHttpClient = new OctetStreamHttpClient(
			httpClient,
			fileSystemClient,
			uuidGenerator,
			configuration.TEMPORARY_DIRECTORY_PATH,
		);

		const basicFlowClient = new BasicFlowHttpClient(httpClient);
		const compressedFlowClient = new CompressedFlowHttpClient(octetStreamHttpClient, unzipClient);
		const octetStreamFlowClient = new OctetStreamFlowHttpClient(octetStreamHttpClient);

		const flowStrategy = new StagesOnFlowNameStrategy(
			configuration,
			basicFlowClient,
			compressedFlowClient,
			octetStreamFlowClient
		);

		return {
			repositories: {
				flowRepository: new MinioHttpFlowRepository(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator,
					flowStrategy,
					loggerStrategy
				),
			},
		};
	}
}
