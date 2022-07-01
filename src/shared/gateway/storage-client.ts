export interface StorageClient {
	createBucket(bucketName: string): Promise<void>;
	populateBucket(bucketName: string, objectName: string, sourceFile: string): Promise<void>;
	getObjectFromBucket(bucketName: string, objectName: string, targetFile: string): Promise<void>;
	listObjectsFromBucket(bucketName: string): Promise<void>;
	setBucketLifecycle(bucketName: string, rule: any): Promise<void>;
}
