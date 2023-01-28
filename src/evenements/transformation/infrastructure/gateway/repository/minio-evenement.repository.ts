import { Client } from "minio";
import { Configuration } from "@evenements/transformation/configuration/configuration";
import { ContentParser } from "@shared/infrastructure/gateway/content.parser";
import { DateService } from "@shared/date.service";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { EvenementsRepository } from "@evenements/transformation/domain/service/evenements.repository";
import { FluxTransformation } from "@evenements/transformation/domain/model/flux";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { LoggerStrategy } from "@shared/configuration/logger";
import { UuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";
import { UnJeuneUneSolution } from "@evenements/transformation/domain/model/1jeune1solution";

export class MinioEvenementRepository implements EvenementsRepository {
	private static readonly JSON_INDENTATION = 2;
	private static readonly LATEST_FILE_NAME = "latest";
	private static readonly JSON_REPLACER = null;
	private static readonly PATH_SEPARATOR = "/";

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly fileSystemClient: FileSystemClient,
		private readonly uuidGenerator: UuidGenerator,
		private readonly dateService: DateService,
		private readonly loggerStrategy: LoggerStrategy,
		private readonly contentParser: ContentParser,
	) {
	}

	public async recuperer<T>(flow: FluxTransformation): Promise<T> {
		this.loggerStrategy.get(flow.nom).info(`Starting to pull flow ${flow.nom}`);
		const fileNameToPull = this.getFileNameToFetch(flow);
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(this.generateFileName());

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO.RAW_BUCKET_NAME,
				fileNameToPull,
				localFileNameIncludingPath
			);
			const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
			return await this.contentParser.parse<T>(fileContent);
		} catch (e) {
			throw new RecupererContenuErreur();
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flow.nom).info(`End of pulling flow ${flow.nom}`);
		}
	}

	public async sauvegarder(evenements: Array<UnJeuneUneSolution.Evenement>, flow: FluxTransformation): Promise<void> {
		this.loggerStrategy.get(flow.nom).info(`Starting to save transformed events offers from flow ${flow.nom}`);
		const contentToSave = this.toReadableJson(evenements);
		const temporaryFileName = this.generateFileName();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, contentToSave);

			await this.saveHistoryFile(flow, localFileNameIncludingPath);
			await this.saveLatestFile(flow, localFileNameIncludingPath);
		} catch (e) {
			this.loggerStrategy.get(flow.nom).info(e);
			throw new EcritureFluxErreur(flow.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flow.nom).info(`End of saving transformed events offers from flow ${flow.nom}`);
		}
	}

	private getFileNameToFetch(flow: FluxTransformation): string {
		const { PATH_SEPARATOR, LATEST_FILE_NAME } = MinioEvenementRepository;
		return flow.nom
			.concat(PATH_SEPARATOR)
			.concat(LATEST_FILE_NAME)
			.concat(flow.extensionFichierBrut);
	}

	private toReadableJson(events: Array<UnJeuneUneSolution.Evenement>): string {
		const { JSON_INDENTATION, JSON_REPLACER } = MinioEvenementRepository;
		return JSON.stringify(events, JSON_REPLACER, JSON_INDENTATION);
	}

	private async saveHistoryFile(flow: FluxTransformation, temporaryFileName: string): Promise<void> {
		const historyFileName = this.createHistoryFileName(flow);
		await this.saveOnMinio(historyFileName, temporaryFileName);
	}

	private async saveLatestFile(flow: FluxTransformation, temporaryFileName: string): Promise<void> {
		const latestFileName = this.createCloneFileName(flow);
		await this.saveOnMinio(latestFileName, temporaryFileName);
	}

	private createCloneFileName(flow: FluxTransformation): string {
		const { PATH_SEPARATOR, LATEST_FILE_NAME } = MinioEvenementRepository;
		return flow.nom
			.concat(PATH_SEPARATOR)
			.concat(LATEST_FILE_NAME)
			.concat(flow.extensionFichierTransforme);
	}

	private createHistoryFileName(flow: FluxTransformation): string {
		const { PATH_SEPARATOR } = MinioEvenementRepository;
		return flow.nom
			.concat(PATH_SEPARATOR)
			.concat(flow.dossierHistorisation)
			.concat(PATH_SEPARATOR)
			.concat(this.dateService.maintenant().toISOString())
			.concat(flow.extensionFichierTransforme);
	}

	private async saveOnMinio(filePath: string, localFileNameIncludingPath: string): Promise<void> {
		await this.minioClient.fPutObject(
			this.configuration.MINIO.TRANSFORMED_BUCKET_NAME,
			filePath,
			localFileNameIncludingPath
		);
	}

	private generateFileName(): string {
		return this.uuidGenerator.generate();
	}
}
