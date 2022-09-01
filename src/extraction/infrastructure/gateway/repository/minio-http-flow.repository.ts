import { Client } from "minio";

import { Configuration } from "@extraction/configuration/configuration";
import { EcritureFluxErreur, FluxRepository } from "@extraction/domain/flux.repository";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { FlowStrategy } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { Flux } from "@extraction/domain/flux";
import { UuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";

export class MinioHttpFlowRepository implements FluxRepository {
	private static COMPRESSED_FILE_EXTENSION = ".gz";
	private static LOCAL_FILE_PATH = "./tmp/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidGenerator: UuidGenerator,
		private readonly flowStrategy: FlowStrategy
	) {
	}

	public recuperer(flow: Flux): Promise<string> {
        return this.flowStrategy.get(flow);
    }

	public async enregistrer(
		cheminFichierIncluantNom: string,
		contenuFlux: string,
		flow: Flux,
		omettreExtension?: boolean
	): Promise<void> {
		const cleanedFilePath = omettreExtension ? this.removeCompressedFileExtension(cheminFichierIncluantNom) : cheminFichierIncluantNom;
		const fileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = MinioHttpFlowRepository.LOCAL_FILE_PATH.concat(fileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, contenuFlux);
			await this.minioClient.fPutObject(
				this.configuration.MINIO_RAW_BUCKET_NAME,
				cleanedFilePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(flow.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	private removeCompressedFileExtension(filePath: string): string {
		const { COMPRESSED_FILE_EXTENSION } = MinioHttpFlowRepository;
		return filePath.replace(COMPRESSED_FILE_EXTENSION, "");
	}
}
