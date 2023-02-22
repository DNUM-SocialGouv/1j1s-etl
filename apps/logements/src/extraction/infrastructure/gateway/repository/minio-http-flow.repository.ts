import { Client } from "minio";

import { Configuration } from "@logements/src/extraction/configuration/configuration";
import { EcritureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { FlowStrategy } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { FluxRepository } from "@logements/src/extraction/domain/service/flux.repository";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class MinioHttpFlowRepository implements FluxRepository {
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
	): Promise<void> {
		this.loggerStrategy.get(flow.nom).info(`Starting to save extracted housing offers from flow ${flow.nom}`);
		const fileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(fileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, contenuFlux);
			await this.minioClient.fPutObject(
				this.configuration.MINIO.RAW_BUCKET_NAME,
				cheminFichierIncluantNom,
				localFileNameIncludingPath,
			);
		} catch (e) {
			this.loggerStrategy.get(flow.nom).error(e);
			throw new EcritureFluxErreur(flow.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flow.nom).info(`End of saving extracted housing offers from flow ${flow.nom}`);
		}
	}
}
