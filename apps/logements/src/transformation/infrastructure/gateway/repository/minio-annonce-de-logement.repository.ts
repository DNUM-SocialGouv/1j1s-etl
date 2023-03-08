import { Client } from "minio";

import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";
import {
	AnnonceDeLogementRepository,
} from "@logements/src/transformation/domain/service/annonce-de-logement.repository";
import { Configuration } from "@logements/src/transformation/infrastructure/configuration/configuration";

import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { ContentParserStrategy } from "@shared/src/infrastructure/gateway/content.parser";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class MinioAnnonceDeLogementRepository implements AnnonceDeLogementRepository {
	private static readonly PATH_SEPARATOR: string = "/";
	private static readonly LATEST_FILE_NAME: string = "latest";
	private static readonly JSON_REPLACER: null = null;
	private static readonly JSON_INDENTATION: number = 2;

	constructor(
		private readonly configuration: Configuration,
		private readonly minioClient: Client,
		private readonly uuidGenerator: UuidGenerator,
		private readonly fileSystemClient: FileSystemClient,
		private readonly dateService: DateService,
		private readonly loggerStrategy: LoggerStrategy,
		private readonly contentParserStrategy: ContentParserStrategy,
	) {
	}

	public async recuperer<T>(flux: FluxTransformation): Promise<T> {
		this.loggerStrategy.get(flux.nom).info(`Starting to pull flow ${flux.nom}`);
		const fileNameToPull = this.getFileName(flux);
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(this.generateFileName());

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO.RAW_BUCKET_NAME,
				fileNameToPull,
				localFileNameIncludingPath,
			);
			const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
			return await this.contentParserStrategy.get<T>(flux, fileContent);
		} catch (e) {
			throw new RecupererContenuErreur();
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flux.nom).info(`Ending to pull flow ${flux.nom}`);
		}
	}

	public async sauvegarder(annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>, flux: FluxTransformation): Promise<void> {
		this.loggerStrategy.get(flux.nom).info(`Starting to save transformed housing adverts from ${flux.nom}`);
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(this.generateFileName());

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, this.toReadableJson(annoncesDeLogement));
			await this.saveFiles(flux, localFileNameIncludingPath);
		} catch (e) {
			throw new EcritureFluxErreur(flux.nom);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flux.nom).info(`Ending to save transformed housing adverts from ${flux.nom}`);
		}
	}

	private getFileName(flow: FluxTransformation): string {
		return flow.nom
			.concat(MinioAnnonceDeLogementRepository.PATH_SEPARATOR)
			.concat(MinioAnnonceDeLogementRepository.LATEST_FILE_NAME)
			.concat(flow.extensionFichierBrut);
	}

	private generateFileName(): string {
		return this.uuidGenerator.generate();
	}

	private toReadableJson(housingAdverts: Array<UnJeune1Solution.AnnonceDeLogement>): string {
		return JSON.stringify(housingAdverts, MinioAnnonceDeLogementRepository.JSON_REPLACER, MinioAnnonceDeLogementRepository.JSON_INDENTATION);
	}

	private async saveFiles(flow: FluxTransformation, localFileNameIncludingPath: string): Promise<void> {
		await this.saveHistoryFile(flow, localFileNameIncludingPath);
		await this.saveLatestFile(flow, localFileNameIncludingPath);
	}

	private async saveHistoryFile(flux: FluxTransformation, localFileNameIncludingPath: string): Promise<void> {
		const historyFileName = this.createHistoryFileName(flux);
		await this.minioClient.fPutObject(this.configuration.MINIO.TRANSFORMED_BUCKET_NAME, historyFileName, localFileNameIncludingPath);
	}

	private async saveLatestFile(flux: FluxTransformation, localFileNameIncludingPath: string): Promise<void> {
		const latestFileName = this.createLatestFileName(flux);
		await this.minioClient.fPutObject(this.configuration.MINIO.TRANSFORMED_BUCKET_NAME, latestFileName, localFileNameIncludingPath);
	}

	private createHistoryFileName(flux: FluxTransformation): string {
		return flux.nom
			.concat(MinioAnnonceDeLogementRepository.PATH_SEPARATOR)
			.concat(flux.dossierHistorisation)
			.concat(MinioAnnonceDeLogementRepository.PATH_SEPARATOR)
			.concat(this.dateService.maintenant().toISOString())
			.concat(flux.extensionFichierTransforme);
	}

	private createLatestFileName(flux: FluxTransformation): string {
		return flux.nom
			.concat(MinioAnnonceDeLogementRepository.PATH_SEPARATOR)
			.concat(MinioAnnonceDeLogementRepository.LATEST_FILE_NAME)
			.concat(flux.extensionFichierTransforme);
	}
}
