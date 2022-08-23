import { Client } from "minio";

import { FileSystemClient } from "@extraction/infrastructure/gateway/common/node-file-system.client";
import { FluxClient } from "@extraction/domain/flux.client";
import { StorageClient } from "@extraction/domain/storage.client";
import { UuidGenerator } from "@extraction/infrastructure/gateway/common/uuid.generator";

export type GatewayContainer = {
	repositories: {
		octetStreamFlowHttpClient: FluxClient
		compressedFluxClient: FluxClient
		fluxClient: FluxClient
	},
	storages: {
		fileSystemClient: FileSystemClient
		minioClient: Client
		storageClient: StorageClient
		uuidClient: UuidGenerator
	},
}
