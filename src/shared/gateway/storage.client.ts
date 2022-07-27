export interface StorageClient {
	enregistrer(filePath: string, fileContent: string, fluxName: string): Promise<void>;
	getObjectFromBucket(bucketName: string, objectName: string, targetFile: string): Promise<void>;
	listObjectsFromBucket(bucketName: string): void;
	setBucketLifecycle(bucketName: string, rule: object): Promise<void>;
}

export class EcritureFluxErreur extends Error {
	constructor(nomFlux: string) {
		super(`Le flux ${nomFlux} n'a pas été extrait car une erreur d'écriture est survenue`);
	}
}
