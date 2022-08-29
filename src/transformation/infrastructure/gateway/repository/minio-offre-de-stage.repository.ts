import { Client } from "minio";

import { Configuration } from "@transformation/configuration/configuration";
import { ContentParser } from "@transformation/infrastructure/gateway/xml-content.parser";
import { DateService } from "@shared/date.service";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/infrastructure/gateway/repository/offre-de-stage.repository";
import { Flux } from "@transformation/domain/flux";
import { FileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export class MinioOffreDeStageRepository implements OffreDeStageRepository {
	private static LOCAL_FILE_PATH = "./tmp/";
	private static readonly JSON_INDENTATION = 2;
	private static readonly LATEST_FILE_NAME = "latest";
	private static readonly JSON_REPLACER = null;
	private static readonly PATH_SEPARATOR = "/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidGenerator: UuidGenerator,
		private readonly contentParserRepository: ContentParser,
		private readonly dateService: DateService
	) {
	}

	async recuperer<T>(flow: Flux): Promise<T> {
		const fileNameToPull = this.getFileNameToFetch(flow);
		const localFileNameIncludingPath = MinioOffreDeStageRepository.LOCAL_FILE_PATH.concat(this.generateFileName());

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO_RAW_BUCKET_NAME,
				fileNameToPull,
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

	async sauvegarder(internshipOffers: UnJeune1Solution.OffreDeStage[], flow: Flux): Promise<void> {
		const contentToSave = this.toReadableJson(internshipOffers);
		const temporaryFileName = this.generateFileName();
		const localFileNameIncludingPath = MinioOffreDeStageRepository.LOCAL_FILE_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, contentToSave);

			await this.saveHistoryFile(flow, localFileNameIncludingPath);
			await this.saveLatestFile(flow, localFileNameIncludingPath);
		} catch (e) {
			throw new EcritureFluxErreur(flow.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	private getFileNameToFetch(flow: Flux): string {
		const { PATH_SEPARATOR, LATEST_FILE_NAME } = MinioOffreDeStageRepository;
		return flow.nom
			.concat(PATH_SEPARATOR)
			.concat(LATEST_FILE_NAME)
			.concat(flow.extensionFichierBrut);
	}

	private toReadableJson(internshipOffers: Array<UnJeune1Solution.OffreDeStage>): string {
		const { JSON_INDENTATION, JSON_REPLACER } = MinioOffreDeStageRepository;
		return JSON.stringify(internshipOffers, JSON_REPLACER, JSON_INDENTATION);
	}

	private async saveHistoryFile(flow: Readonly<Flux>, temporaryFileName: string): Promise<void> {
		const historyFileName = this.createHistoryFileName(flow);
		await this.saveOnMinio(historyFileName, temporaryFileName);
	}

	private async saveLatestFile(flow: Readonly<Flux>, temporaryFileName: string): Promise<void> {
		const latestFileName = this.createCloneFileName(flow);
		await this.saveOnMinio(latestFileName, temporaryFileName);
	}

	private createCloneFileName(flow: Readonly<Flux>): string {
		const { PATH_SEPARATOR, LATEST_FILE_NAME } = MinioOffreDeStageRepository;
		return flow.nom
			.concat(PATH_SEPARATOR)
			.concat(LATEST_FILE_NAME)
			.concat(flow.extensionFichierTransforme);
	}

	private createHistoryFileName(flow: Readonly<Flux>): string {
		const { PATH_SEPARATOR } = MinioOffreDeStageRepository;
		return flow.nom
			.concat(PATH_SEPARATOR)
			.concat(flow.dossierHistorisation)
			.concat(PATH_SEPARATOR)
			.concat(this.dateService.maintenant().toISOString())
			.concat(flow.extensionFichierTransforme);
	}

	private async saveOnMinio(filePath: string, localFileNameIncludingPath: string): Promise<void> {
		await this.minioClient.fPutObject(
			this.configuration.MINIO_TRANSFORMED_BUCKET_NAME,
			filePath,
			localFileNameIncludingPath
		);
	}

	private generateFileName(): string {
		return this.uuidGenerator.generate();
	}
}
