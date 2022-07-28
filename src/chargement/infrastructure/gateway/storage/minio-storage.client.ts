import { Client } from "minio";

import { EcritureFluxErreur, StorageClient } from "@shared/gateway/storage.client";
import { Configuration } from "@configuration/configuration";
import { FileSystemClient } from "@transformation/infrastructure/gateway/storage/node-file-system.client";
import { UuidClient } from "@transformation/infrastructure/gateway/storage/uuid.client";

export class MinioStorageClient implements StorageClient {
	static LOCAL_FILE_PATH = "./tmp/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidClient: UuidClient
	) {
	}

	async enregistrer(filePath: string, fileContent: string, fluxName: string): Promise<void> {
		const fileName = this.uuidClient.generate();
		const localFileNameIncludingPath = MinioStorageClient.LOCAL_FILE_PATH.concat(fileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO_RAW_BUCKET_NAME,
				filePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(fluxName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	async createBucket(bucketName: string): Promise<void> {
		const bucket = await this.minioClient.bucketExists(bucketName);

		if (!bucket) {
			await this.minioClient
				.makeBucket(bucketName, "none");
		}
	}

	async getObjectFromBucket(bucketName: string, objectName: string, targetFilePath: string): Promise<void> {
		await this.minioClient.fGetObject(bucketName, objectName, targetFilePath);
	}

	listObjectsFromBucket(bucketName: string): void {
		const stream = this.minioClient.listObjects(bucketName, "history/", true);
		stream.on("data", (item) => console.info(item));
	}

	async setBucketLifecycle(bucketName: string, rule: object): Promise<void> {
		await this.minioClient.setBucketLifecycle(bucketName, {
			Rule: [{
				Expiration: {
					Days: 30,
				},
				ID: "history",
				Filter: {
					Prefix: "history/",
				},
				Status: "Enabled",
			}, {
				Expiration: {
					Days: 130,
				},
				ID: "diff",
				Filter: {
					Prefix: "diff/",
				},
				Status: "Enabled",
			},
				rule,
			],
		});
	}
}
