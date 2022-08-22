import { Client } from "minio";

import { Configuration } from "@configuration/configuration";
import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { ContentParser } from "@transformation/infrastructure/gateway/xml-content.parser";
import { DateService } from "@shared/date.service";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/gateway/offre-de-stage.repository";
import { FileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export class MinioOffreDeStageRepository implements OffreDeStageRepository {
	static LOCAL_FILE_PATH = "./tmp/";
	static readonly JSON_INDENTATION = 2;
	static readonly LATEST_FILE_NAME = "latest";
	static readonly JSON_REPLACER = null;
	static readonly PATH_SEPARATOR = "/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidClient: UuidGenerator,
		private readonly contentParserRepository: ContentParser,
		private readonly dateService: DateService
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

	async sauvegarder(offresDeStage: UnJeune1Solution.OffreDeStage[], flowConfiguration: ConfigurationFlux): Promise<void> {
		const contentToSave = this.toReadableJson(offresDeStage);
		const temporaryFileName = this.uuidClient.generate();
		const localFileNameIncludingPath = MinioOffreDeStageRepository.LOCAL_FILE_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, contentToSave);

			await this.saveHistoryFile(flowConfiguration, localFileNameIncludingPath);
			await this.saveLatestFile(flowConfiguration, localFileNameIncludingPath);
		} catch (e) {
			throw new EcritureFluxErreur(flowConfiguration.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	private toReadableJson(contenuTransforme: Array<UnJeune1Solution.OffreDeStage>): string {
		const { JSON_INDENTATION, JSON_REPLACER } = MinioOffreDeStageRepository;
		return JSON.stringify(contenuTransforme, JSON_REPLACER, JSON_INDENTATION);
	}

	private async saveHistoryFile(configurationFlux: Readonly<ConfigurationFlux>, temporaryFileName: string): Promise<void> {
		const historyFileName = this.createHistoryFileName(configurationFlux);
		await this.saveOnMinio(historyFileName, temporaryFileName);
	}

	private async saveLatestFile(configurationFlux: Readonly<ConfigurationFlux>, temporaryFileName: string): Promise<void> {
		const latestFileName = this.createCloneFileName(configurationFlux);
		await this.saveOnMinio(latestFileName, temporaryFileName);
	}

	private createCloneFileName(flowConfiguration: Readonly<ConfigurationFlux>): string {
		const { PATH_SEPARATOR, LATEST_FILE_NAME } = MinioOffreDeStageRepository;
		return flowConfiguration.nom
			.concat(PATH_SEPARATOR)
			.concat(LATEST_FILE_NAME)
			.concat(flowConfiguration.extensionFichierTransforme);
	}

	private createHistoryFileName(flowConfiguration: Readonly<ConfigurationFlux>): string {
		const { PATH_SEPARATOR } = MinioOffreDeStageRepository;
		return flowConfiguration.nom
			.concat(PATH_SEPARATOR)
			.concat(flowConfiguration.dossierHistorisation)
			.concat(PATH_SEPARATOR)
			.concat(this.dateService.maintenant().toISOString())
			.concat(flowConfiguration.extensionFichierTransforme);
	}

	private async saveOnMinio(filePath: string, localFileNameIncludingPath: string): Promise<void> {
		await this.minioClient.fPutObject(
			this.configuration.MINIO_TRANSFORMED_BUCKET_NAME,
			filePath,
			localFileNameIncludingPath
		);
	}
}
