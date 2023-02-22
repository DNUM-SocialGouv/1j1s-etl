import { Client } from "minio";

import { Configuration } from "@stages/src/chargement/configuration/configuration";
import {
	EcritureFluxErreur,
	RecupererContenuErreur,
	RecupererOffresExistantesErreur,
} from "@shared/src/infrastructure/gateway/flux.erreur";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { HttpClient } from "@stages/src/chargement/infrastructure/gateway/client/http.client";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class MinioHttpOffreDeStageRepository implements UnJeune1Solution.OffreDeStageRepository {
	protected static NOM_DU_FICHIER_A_RECUPERER = "latest";

	constructor(
		protected readonly configuration: Configuration,
		protected readonly minioClient: Client,
		protected readonly fileSystemClient: FileSystemClient,
		protected readonly uuidGenerator: UuidGenerator,
		protected readonly httpClient: HttpClient,
		protected readonly loggerStrategy: LoggerStrategy,
	) {
	}

	public async charger(source: string, offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Promise<Array<UnJeune1Solution.OffreDeStageEnErreur>> {
		const logger = this.loggerStrategy.get(source);
		logger.info(`Starting to load internship offers from flow ${source}`);
		logger.info(`The ${source} flow have ${offresDeStages.length} internship offers outdated`);

		const offresDeStageEnErreur: Array<UnJeune1Solution.OffreDeStageEnErreur> = [];

		for (const offreDeStage of offresDeStages) {
			await this.chargerOffreDeStageSelonType(offreDeStage, offresDeStageEnErreur);
		}

		logger.info(`The ${source} flow have ${offresDeStageEnErreur.length} internship offers not updated`);
		logger.info(`Ending to load internship offers from flow ${source}`);

		return offresDeStageEnErreur;
	}

	public async recupererMisesAJourDesOffres(flowName: string): Promise<UnJeune1Solution.OffreDeStage[]> {
		this.loggerStrategy.get(flowName).info(`Starting to pull latest internship offers from flow ${flowName}`);
		const temporaryFileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);
		const sourceFilePath = `${flowName}/${MinioHttpOffreDeStageRepository.NOM_DU_FICHIER_A_RECUPERER}${this.configuration.MINIO.TRANSFORMED_FILE_EXTENSION}`;

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO.TRANSFORMED_BUCKET_NAME,
				sourceFilePath,
				localFileNameIncludingPath
			);
			const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
			return (<Array<UnJeune1Solution.AttributsDOffreDeStage>>JSON.parse(fileContent.toString()))
				.map((offreDeStage) => new UnJeune1Solution.OffreDeStage(offreDeStage));
		} catch (e) {
			throw new RecupererContenuErreur();
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flowName).info(`End of pulling latest internship offers from flow ${flowName}`);
		}
	}

	public async recupererOffresExistantes(source: string): Promise<Array<UnJeune1Solution.OffreDeStageExistante>> {
		this.loggerStrategy.get(source).info(`Starting to pull existing internship offers from flow ${source}`);
		try {
			const offresDeStagesExistantesHttp = await this.httpClient.getAll(source);

			return offresDeStagesExistantesHttp.map((offreDeStageHttp) => new UnJeune1Solution.OffreDeStageExistante(
				offreDeStageHttp.id,
				offreDeStageHttp.attributes.identifiantSource,
				offreDeStageHttp.attributes.sourceUpdatedAt,
			));
		} catch (e) {
			throw new RecupererOffresExistantesErreur();
		} finally {
			this.loggerStrategy.get(source).info(`End of pulling existing internship offers from flow ${source}`);
		}
	}

	public async enregistrer(filePath: string, fileContent: string, flowName: string): Promise<void> {
		this.loggerStrategy.get(flowName).info(`Starting to save flow ${flowName}`);
		const temporaryFileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO.RESULT_BUCKET_NAME,
				filePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(flowName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
			this.loggerStrategy.get(flowName).info(`End of saving flow ${flowName}`);
		}
	}

	private async chargerOffreDeStageSelonType(
		offreDeStage: UnJeune1Solution.OffreDeStage,
		offresDeStageEnErreur: Array<UnJeune1Solution.OffreDeStageEnErreur>
	): Promise<void> {
		try {
			if (offreDeStage instanceof UnJeune1Solution.OffreDeStageAPublier) {
				await this.httpClient.post(offreDeStage);
			} else if (offreDeStage instanceof UnJeune1Solution.OffreDeStageASupprimer) {
				await this.httpClient.delete(offreDeStage);
			} else if (offreDeStage instanceof UnJeune1Solution.OffreDeStageAMettreAJour) {
				await this.httpClient.put(offreDeStage);
			} else {
				this.loggerStrategy.get((offreDeStage.source)).error({
					extra: { offreDeStage },
					msg: `L'offre de stage avec l'identifiant ${offreDeStage.identifiantSource || "undefined"} n'a pas pu être catégorisée`,
				});
				offresDeStageEnErreur.push({
					contenuDeLOffre: offreDeStage,
					motif: `L'offre de stage avec l'identifiant ${offreDeStage.identifiantSource || "undefined"} n'a pas pu être catégorisée`,
				});
			}
		} catch (e) {
			this.loggerStrategy.get((offreDeStage.source)).error({ extra: { offreDeStage }, msg: JSON.stringify(e) });
			offresDeStageEnErreur.push({
				contenuDeLOffre: offreDeStage,
				motif: (<Error>e).stack || (<Error>e).message,
			});
		}
	}
}
