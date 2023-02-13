import { Client } from "minio";
import { Configuration } from "@evenements/src/transformation/configuration/configuration";
import { ContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { DateService } from "@shared/src/date.service";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";
import { FluxTransformation } from "@evenements/src/transformation/domain/model/flux";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import { UnJeuneUneSolution } from "@evenements/src/transformation/domain/model/1jeune1solution";

export class MinioEvenementRepository implements EvenementsRepository {
	private static readonly JSON_INDENTATION: number = 2;
	private static readonly LATEST_FILE_NAME: string = "latest";
	private static readonly JSON_REPLACER: null = null;
	private static readonly PATH_SEPARATOR: string = "/";

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
		return flow.nom
			.concat(MinioEvenementRepository.PATH_SEPARATOR)
			.concat(MinioEvenementRepository.LATEST_FILE_NAME)
			.concat(flow.extensionFichierBrut);
	}

	private toReadableJson(events: Array<UnJeuneUneSolution.Evenement>): string {
		return JSON.stringify(events, MinioEvenementRepository.JSON_REPLACER, MinioEvenementRepository.JSON_INDENTATION);
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
		return flow.nom
			.concat(MinioEvenementRepository.PATH_SEPARATOR)
			.concat(MinioEvenementRepository.LATEST_FILE_NAME)
			.concat(flow.extensionFichierTransforme);
	}

	private createHistoryFileName(flow: FluxTransformation): string {
		return flow.nom
			.concat(MinioEvenementRepository.PATH_SEPARATOR)
			.concat(flow.dossierHistorisation)
			.concat(MinioEvenementRepository.PATH_SEPARATOR)
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
