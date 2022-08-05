import { Client } from "minio";

export class MinioAdminStorageRepository {
	static REGION = "none";

	constructor(
		private readonly minioClient: Client,
	) {
	}

	async createBucket(bucketName: string): Promise<void> {
		if (!(await this.bucketExists(bucketName))) {
			return this.minioClient.makeBucket(bucketName, MinioAdminStorageRepository.REGION);
		}
	}

	private bucketExists(bucketName: string): Promise<boolean> {
		return this.minioClient.bucketExists(bucketName);
	}
}
