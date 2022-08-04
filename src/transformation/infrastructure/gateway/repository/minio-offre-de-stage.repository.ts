import { Client } from "minio";

import { Configuration } from "@configuration/configuration";
import {
	ContentParser,
} from "@transformation/infrastructure/gateway/xml-content.parser";
import { EcritureFluxErreur, RecupererContenuErreur} from "@shared/gateway/offre-de-stage.repository";
import { FileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";

export class MinioOffreDeStageRepository implements OffreDeStageRepository {
	static LOCAL_FILE_PATH = "./tmp/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidClient: UuidGenerator,
		private readonly contentParserRepository: ContentParser
	) {
	}

	async recuperer<T>(sourcefilePath: string): Promise<T> {
		const temporaryFileName = this.uuidClient.generate();
		const localFileNameIncludingPath = MinioOffreDeStageRepository.LOCAL_FILE_PATH.concat(temporaryFileName);

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

	async enregistrer(filePath: string, fileContent: string, sourceName: string): Promise<void> {
		const temporaryFileName = this.uuidClient.generate();
		const localFileNameIncludingPath = MinioOffreDeStageRepository.LOCAL_FILE_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO_TRANSFORMED_BUCKET_NAME,
				filePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(sourceName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}
}
