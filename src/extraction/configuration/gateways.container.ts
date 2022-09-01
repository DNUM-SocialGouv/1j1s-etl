import axios from "axios";
import { Client } from "minio";

import { BasicFlowHttpClient } from "@extraction/infrastructure/gateway/client/basic-flow-http.client";
import { CompressedFlowHttpClient } from "@extraction/infrastructure/gateway/client/compressed-flow-http.client";
import { Configuration } from "@extraction/configuration/configuration";
import { GatewayContainer } from "@extraction/infrastructure/gateway";
import { MinioHttpFlowRepository } from "@extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";
import { OctetStreamFlowHttpClient } from "@extraction/infrastructure/gateway/client/octet-stream-flow-http.client";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@extraction/infrastructure/gateway/common/unzip.client";
import { OnFlowNameStrategy } from "@extraction/infrastructure/gateway/client/flow.strategy";

export class GatewayContainerFactory {
	static create(configuration: Configuration): GatewayContainer {
		const httpClient = axios.create({
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});

		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO_ACCESS_KEY,
			secretKey: configuration.MINIO_SECRET_KEY,
			port: configuration.MINIO_PORT,
			endPoint: configuration.MINIO_URL,
		});
		const uuidGenerator = new NodeUuidGenerator();
		const unzipClient = new UnzipClient();
		const octetStreamHttpClient = new OctetStreamHttpClient(httpClient, fileSystemClient, uuidGenerator);

		const basicFlowClient = new BasicFlowHttpClient(httpClient);
		const compressedFlowClient = new CompressedFlowHttpClient(octetStreamHttpClient, unzipClient);
		const octetStreamFlowClient = new OctetStreamFlowHttpClient(octetStreamHttpClient);

		const flowStrategy = new OnFlowNameStrategy(
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
					flowStrategy
				),
			},
		};
	}
}
