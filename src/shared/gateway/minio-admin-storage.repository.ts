import { Client, Lifecycle } from "minio";

export class MinioAdminStorageRepository {
	static REGION = "none";

	constructor(private readonly minioClient: Client) {
	}

	async createBucket(bucketName: string): Promise<void> {
		if (!(await this.bucketExists(bucketName))) {
			return this.minioClient.makeBucket(bucketName, MinioAdminStorageRepository.REGION);
		}
	}

	private bucketExists(bucketName: string): Promise<boolean> {
		return this.minioClient.bucketExists(bucketName);
	}

	async setBucketLifecycle(bucketName: string, rules: LifecycleRules): Promise<void> {
		await this.minioClient.setBucketLifecycle(bucketName, rules);
	}

	async getRulesOnBucket(bucketName: string): Promise<Lifecycle> {
		return await this.minioClient.getBucketLifecycle(bucketName);
	}
}

export type LifecycleRules = {
	Rule: Array<LifecycleRule>
}

export type LifecycleRule = {
	Expiration: {
		Days: number
	},
	ID: string,
	Filter: {
		Prefix: string
	},
	Status: "Enabled" | "Disabled"
}
