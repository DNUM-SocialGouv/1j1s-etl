import { Client } from "minio";

export class MinioAdminStorageClient {
	static REGION = "none";

	constructor(
		private readonly minioClient: Client,
	) {
	}

	async createBucket(bucketName: string): Promise<void> {
		if (!(await this.bucketExists(bucketName))) {
			await this.minioClient.makeBucket(bucketName, MinioAdminStorageClient.REGION);
		}
	}

	private bucketExists(bucketName: string): Promise<boolean> {
		return this.minioClient.bucketExists(bucketName);
	}
}
