import axios from "axios";
import { Client } from "minio";

import { BasicFlowHttpClient } from "@extraction/infrastructure/gateway/repository/basic-flow-http.client";
import { CompressedFlowHttpClient } from "@extraction/infrastructure/gateway/repository/compressed-flow-http.client";
import { Configuration } from "@configuration/configuration";
import { GatewayContainer } from "@extraction/infrastructure/gateway";
import { MinioStorageClient } from "@extraction/infrastructure/gateway/storage/minio-storage.client";
import { NodeFileSystemClient } from "@extraction/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@extraction/infrastructure/gateway/common/uuid.generator";
import { OctetStreamFlowHttpClient } from "@extraction/infrastructure/gateway/repository/octet-stream-flow-http.client";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@extraction/infrastructure/gateway/common/unzip.client";

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

		return {
			repositories: {
				octetStreamFlowHttpClient : new OctetStreamFlowHttpClient(octetStreamHttpClient),
				compressedFluxClient: new CompressedFlowHttpClient(octetStreamHttpClient, unzipClient),
				fluxClient: new BasicFlowHttpClient(httpClient),
			},
			storages: {
				fileSystemClient,
				minioClient,
				storageClient: new MinioStorageClient(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator
				),
				uuidClient: uuidGenerator,
			},
		};
	}
}
