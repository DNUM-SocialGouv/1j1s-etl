import { Client, Lifecycle } from "minio";

export class MinioAdminStorageRepository {
	private static REGION = "none";

	constructor(private readonly minioClient: Client) {
	}

	public async createBucket(bucketName: string): Promise<void> {
		if (!(await this.bucketExists(bucketName))) {
			return this.minioClient.makeBucket(bucketName, MinioAdminStorageRepository.REGION);
		}
	}

	public setBucketLifecycle(bucketName: string, rules: LifecycleRules): Promise<void> {
		return this.minioClient.setBucketLifecycle(bucketName, rules);
	}

	public getRulesOnBucket(bucketName: string): Promise<Lifecycle> {
		return this.minioClient.getBucketLifecycle(bucketName);
	}

	private bucketExists(bucketName: string): Promise<boolean> {
		return this.minioClient.bucketExists(bucketName);
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
