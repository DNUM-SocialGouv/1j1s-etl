import { Client } from "minio";

import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FlowStrategy } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { EcritureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { FluxRepository } from "@stages/src/extraction/domain/service/flux.repository";
import { Configuration } from "@stages/src/extraction/infrastructure/configuration/configuration";

export class MinioHttpFlowRepository implements FluxRepository {
	private static COMPRESSED_FILE_EXTENSION = ".gz";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidGenerator: UuidGenerator,
		private readonly flowStrategy: FlowStrategy,
		private readonly loggerStrategy: LoggerStrategy,
	) {
	}

	public recuperer(flow: FluxExtraction): Promise<string> {
		const logger = this.loggerStrategy.get(flow.nom);
		return this.flowStrategy.get(flow, logger);
	}

	public async enregistrer(
		cheminFichierIncluantNom: string,
		contenuFlux: string,
		flow: FluxExtraction,
		omettreExtension?: boolean
	): Promise<void> {
		this.loggerStrategy.get(flow.nom).info(`Starting to save extracted internship offers from flow ${flow.nom}`);
		const cleanedFilePath = omettreExtension ? this.removeCompressedFileExtension(cheminFichierIncluantNom) : cheminFichierIncluantNom;
		const fileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(fileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, contenuFlux);
			await this.minioClient.fPutObject(
				this.configuration.MINIO.RAW_BUCKET_NAME,
				cleanedFilePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			this.loggerStrategy.get(flow.nom).error(e);
			throw new EcritureFluxErreur(flow.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flow.nom).info(`End of saving extracted internship offers from flow ${flow.nom}`);
		}
	}

	private removeCompressedFileExtension(filePath: string): string {
		const { COMPRESSED_FILE_EXTENSION } = MinioHttpFlowRepository;
		return filePath.replace(COMPRESSED_FILE_EXTENSION, "");
	}
}
