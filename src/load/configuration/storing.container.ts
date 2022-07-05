import * as Minio from "minio";

import { Configuration } from "../../configuration/configuration";
import { MinioStorageClient } from "../infrastructure/gateway/storing/minio-storage.client";
import { StoringContainer } from "../infrastructure/gateway/storing";

export function createStoringContainer(configuration: Configuration): StoringContainer {
	const minioclient = new Minio.Client({
		endPoint: process.env.MINIO_URL!,
		port: 443,
		useSSL: true,
		accessKey: process.env.MINIO_ACCESS_KEY!,
		secretKey: process.env.MINIO_SECRET_KEY!
	});

	return {
		StorageClient: new MinioStorageClient(minioclient)
	}
}
