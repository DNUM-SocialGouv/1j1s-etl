import { Client, LifecycleConfig } from "minio";

export class MinioAdminStorageRepository {
	private static REGION = "none";

	constructor(private readonly minioClient: Client) {
	}

	public async createBucket(bucketName: string): Promise<void> {
		if (!(await this.bucketExists(bucketName))) {
			return this.minioClient.makeBucket(bucketName, MinioAdminStorageRepository.REGION);
		}
	}

	public setBucketLifecycle(bucketName: string, rules: LifecycleConfig): Promise<void> {
		return this.minioClient.setBucketLifecycle(bucketName, rules);
	}

	private bucketExists(bucketName: string): Promise<boolean> {
		return this.minioClient.bucketExists(bucketName);
	}
}
