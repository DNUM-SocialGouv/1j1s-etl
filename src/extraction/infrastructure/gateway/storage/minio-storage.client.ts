import { Client } from "minio";

import { Configuration } from "@configuration/configuration";
import { EcritureFluxErreur, StorageClient } from "@extraction/domain/storage.client";
import { FileSystemClient } from "@extraction/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@extraction/infrastructure/gateway/common/uuid.generator";

export class MinioStorageClient implements StorageClient {
	static COMPRESSED_FILE_EXTENSION = ".gz";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidClient: UuidGenerator
	) {
	}

	async enregistrer(
		filePath: string,
		fileContent: string,
		fluxName: string,
		skipExtension = true
	): Promise<void> {
		const cleanedFilePath = skipExtension ? this.removeCompressedFileExtension(filePath) : filePath;
		const fileName = this.uuidClient.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(fileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO_RAW_BUCKET_NAME,
				cleanedFilePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(fluxName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	private removeCompressedFileExtension(filePath: string): string {
		const { COMPRESSED_FILE_EXTENSION } = MinioStorageClient;
		return filePath.replace(COMPRESSED_FILE_EXTENSION, "");
	}
}
