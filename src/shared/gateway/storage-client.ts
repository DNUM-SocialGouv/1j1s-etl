export interface StorageClient {
	createBucket(bucketName: string): Promise<void>;
	populateBucket(bucketName: string, objectName: string, sourceFile: string): Promise<void>;
	getObjectFromBucket(bucketName: string, objectName: string, targetFile: string): Promise<void>;
	listObjectsFromBucket(bucketName: string): void;
	setBucketLifecycle(bucketName: string, rule: object): Promise<void>;
}
