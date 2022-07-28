import { Client } from "minio";

import { Configuration } from "@configuration/configuration";
import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { MinioStorageClient } from "@transformation/infrastructure/gateway/storage/minio-storage.client";
import { NodeFileSystemClient } from "@transformation/infrastructure/gateway/storage/node-file-system.client";
import { NodeUuidClient } from "@transformation/infrastructure/gateway/storage/uuid.client";
import { XmlContentParserRepository } from "@transformation/infrastructure/gateway/repository/xml-content-parser.repository";

export class GatewayContainerFactory {
	static create(configuration: Configuration): GatewayContainer {
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO_ACCESS_KEY,
			secretKey: configuration.MINIO_SECRET_KEY,
			port: configuration.MINIO_PORT,
			endPoint: configuration.MINIO_URL,
		});
		const uuidClient = new NodeUuidClient();

		return {
			repositories: {
				fluxRepository: new XmlContentParserRepository(),
			},
			storages: {
				storageClient: new MinioStorageClient(configuration, minioClient, fileSystemClient, uuidClient),
			},
		};
	}
}
