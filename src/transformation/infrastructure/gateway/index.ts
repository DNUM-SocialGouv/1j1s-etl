import { Client } from "minio";

import { StorageClient } from "@shared/gateway/storage.client";
import {
	ContentParserRepository,
} from "@transformation/infrastructure/gateway/repository/xml-content-parser.repository";

export type GatewayContainer = {
	repositories: {
		contentParserRepository: ContentParserRepository
	};
	storages: {
		minioClient: Client
		storageClient: StorageClient
	};
}
