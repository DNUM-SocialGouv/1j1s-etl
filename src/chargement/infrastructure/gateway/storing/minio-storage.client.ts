import { StorageClient } from "../../../../shared/gateway/storage-client";
import * as Minio from 'minio';

export class MinioStorageClient implements StorageClient {
	constructor(private readonly minioClient: Minio.Client) {
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

	async listObjectsFromBucket(bucketName: string): Promise<void> {
		const stream = await this.minioClient.listObjects(bucketName, 'history/', true);
		stream.on("data", (item) => console.info(item));
	}

	async populateBucket(bucketName: string, objectName: string, sourceFile: string): Promise<void> {
		await this.minioClient.fPutObject(bucketName, objectName, sourceFile);
	}

	async setBucketLifecycle(bucketName: string, rule: any): Promise<void> {
		await this.minioClient.setBucketLifecycle(bucketName, {
			Rule: [{
				Expiration: {
					Days: 30
				},
				ID: "history",
				Filter: {
					Prefix: "history/",
				},
				Status: "Enabled"
			}, {
				Expiration: {
					Days: 130
				},
				ID: "diff",
				Filter: {
					Prefix: "diff/",
				},
				Status: "Enabled"
			}]
		});
	}
}
