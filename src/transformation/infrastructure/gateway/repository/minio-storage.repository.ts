import { Client } from "minio";

import { Configuration } from "@configuration/configuration";
import {
	ContentParser,
} from "@transformation/infrastructure/gateway/xml-content.parser";
import { EcritureFluxErreur, RecupererContenuErreur, StorageRepository } from "@shared/gateway/storage.repository";
import { FileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { UuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";

export class MinioStorageRepository implements StorageRepository {
	static LOCAL_FILE_PATH = "./tmp/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidClient: UuidGenerator,
		private readonly contentParserRepository: ContentParser
	) {
	}

	async recupererContenu<T>(sourcefilePath: string): Promise<T> {
		const fileName = this.uuidClient.generate();
		const localFileNameIncludingPath = MinioStorageRepository.LOCAL_FILE_PATH.concat(fileName);

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO_RAW_BUCKET_NAME,
				sourcefilePath,
				localFileNameIncludingPath
			);
			const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
			return await this.contentParserRepository.parse<T>(fileContent);
		} catch (e) {
			throw new RecupererContenuErreur();
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	async enregistrer(filePath: string, fileContent: string, fluxName: string): Promise<void> {
		const fileName = this.uuidClient.generate();
		const localFileNameIncludingPath = MinioStorageRepository.LOCAL_FILE_PATH.concat(fileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO_JSON_BUCKET_NAME,
				filePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(fluxName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}
}
