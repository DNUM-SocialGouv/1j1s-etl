import { Client } from "minio";

import { UnJeuneUneSolution } from "@formations-initiales/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@formations-initiales/src/transformation/domain/model/flux";
import {
  FormationsInitialesRepository,
} from "@formations-initiales/src/transformation/domain/service/formations-initiales.repository";
import { Configuration } from "@formations-initiales/src/transformation/infrastructure/configuration/configuration";

import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { ContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class MinioFormationsInitialesRepository implements FormationsInitialesRepository {
  private static readonly PATH_SEPARATOR: string = "/";
  private static readonly LATEST_FILE_NAME: string = "latest";
  private static readonly JSON_REPLACER: null = null;
  private static readonly JSON_INDENTATION: number = 2;

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
  
  public async recuperer<T>(flux: FluxTransformation): Promise<T> {
    this.loggerStrategy.get(flux.nom).info(`Starting to pull flow ${flux.nom}`);
    const fileNameToPull = this.getFileNameToFetch(flux);
    const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(this.generateFileName());

    try {
      await this.minioClient.fGetObject(
        this.configuration.MINIO.RAW_BUCKET_NAME,
        fileNameToPull,
        localFileNameIncludingPath,
      );
      const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
      const t = await this.contentParser.parse<T>(fileContent);
      return t;
    } catch (e) {
      throw new RecupererContenuErreur();
    } finally {
      await this.fileSystemClient.delete(localFileNameIncludingPath);
      this.loggerStrategy.get(flux.nom).info(`Flow ${flux.nom} pulled`);
    }
  }

  public async sauvegarder(formationsInitiales: Array<UnJeuneUneSolution.FormationInitiale>, flux: FluxTransformation): Promise<void> {
    this.loggerStrategy.get(flux.nom).info(`Starting to push flow ${flux.nom}`);
    const temporaryFileName = this.generateFileName();
    const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);

    try {
      await this.fileSystemClient.write(localFileNameIncludingPath, this.toReadableJson(formationsInitiales));
      await this.saveFiles(flux, localFileNameIncludingPath);
    } catch (e) {
      throw new EcritureFluxErreur(flux.nom);
    } finally {
      await this.fileSystemClient.delete(localFileNameIncludingPath);
      this.loggerStrategy.get(flux.nom).info(`Flow ${flux.nom} pushed`);
    }
  }

  private toReadableJson(formationsInitiales: Array<UnJeuneUneSolution.FormationInitiale>): string {
    return JSON.stringify(formationsInitiales, MinioFormationsInitialesRepository.JSON_REPLACER, MinioFormationsInitialesRepository.JSON_INDENTATION);
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
      .concat(MinioFormationsInitialesRepository.PATH_SEPARATOR)
      .concat(flux.dossierHistorisation)
      .concat(MinioFormationsInitialesRepository.PATH_SEPARATOR)
      .concat(this.dateService.maintenant().toISOString())
      .concat(flux.extensionFichierTransforme);
  }
  
  private createLatestFileName(flux: FluxTransformation): string {
    return flux.nom
      .concat(MinioFormationsInitialesRepository.PATH_SEPARATOR)
      .concat(MinioFormationsInitialesRepository.LATEST_FILE_NAME)
      .concat(flux.extensionFichierTransforme);
  }

  private getFileNameToFetch(flow: FluxTransformation): string {
    return flow.nom
      .concat(MinioFormationsInitialesRepository.PATH_SEPARATOR)
      .concat(MinioFormationsInitialesRepository.LATEST_FILE_NAME)
      .concat(flow.extensionFichierBrut);
  }

  private generateFileName(): string {
    return this.uuidGenerator.generate();
  }
}
