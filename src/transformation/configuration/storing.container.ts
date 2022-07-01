import { StoringContainer } from "../infrastructure/gateway/storing";
import { MinioStorageClient } from "../infrastructure/gateway/storing/minio-storage.client";
import * as Minio from "minio";

export function createStoringContainer(): StoringContainer {
	const minioclient = new Minio.Client({
		endPoint: process.env.MINIO_URL!,
		port: 443,
		useSSL: true,
		accessKey: process.env.MINIO_ACCESS_KEY!,
		secretKey: process.env.MINIO_SECRET_KEY!
	});

	return {
		StoragageClient: new MinioStorageClient(minioclient)
	}
}
