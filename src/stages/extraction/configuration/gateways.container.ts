import axios from "axios";
import { Client } from "minio";

import { BasicFlowHttpClient } from "@shared/infrastructure/gateway/client/basic-flow-http.client";
import { CompressedFlowHttpClient } from "@shared/infrastructure/gateway/client/compressed-flow-http.client";
import { Configuration } from "@stages/extraction/configuration/configuration";
import { GatewayContainer } from "@stages/extraction/infrastructure/gateway";
import { LoggerStrategy } from "@shared/configuration/logger";
import { MinioHttpFlowRepository } from "@stages/extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";
import { OctetStreamFlowHttpClient } from "@shared/infrastructure/gateway/client/octet-stream-flow-http.client";
import { OctetStreamHttpClient } from "@shared/infrastructure/gateway/common/octet-stream-http.client";
import { StagesOnFlowNameStrategy } from "@stages/extraction/infrastructure/gateway/client/flow.strategy";
import { UnzipClient } from "@shared/infrastructure/gateway/common/unzip.client";

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