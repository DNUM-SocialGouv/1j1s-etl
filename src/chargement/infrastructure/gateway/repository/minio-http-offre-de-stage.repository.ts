import { Client } from "minio";

import { Configuration } from "@chargement/configuration/configuration";
import {
	EcritureFluxErreur,
	RecupererContenuErreur,
	RecupererOffresExistantesErreur,
} from "@shared/gateway/offre-de-stage.repository";
import { FileSystemClient } from "@chargement/infrastructure/gateway/node-file-system.client";
import { HttpClient } from "@chargement/infrastructure/gateway/http.client";
import { Logger } from "@shared/configuration/logger";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";
import { UuidGenerator } from "@chargement/infrastructure/gateway/uuid.generator";

export class MinioHttpOffreDeStageRepository implements UnJeune1Solution.OffreDeStageRepository {
	static NOM_DU_FICHIER_A_RECUPERER = "latest";

	constructor(
		protected readonly configuration: Configuration,
		protected readonly minioClient: Client,
		protected readonly fileSystemClient: FileSystemClient,
		protected readonly uuidGenerator: UuidGenerator,
		protected readonly httpClient: HttpClient,
		protected readonly logger: Logger,
	) {
	}

	async charger(offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Promise<Array<UnJeune1Solution.OffreDeStageEnErreur>> {
		const offresDeStageEnErreur: Array<UnJeune1Solution.OffreDeStageEnErreur> = [];

		for (const offreDeStage of offresDeStages) {
			await this.chargerOffreDeStageSelonType(offreDeStage, offresDeStageEnErreur);
		}

		return offresDeStageEnErreur;
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
				this.logger.error(`L'offre de stage avec l'identifiant ${offreDeStage.identifiantSource || "undefined"} n'a pas pu être catégorisée`);
				offresDeStageEnErreur.push({
					contenuDeLOffre: offreDeStage,
					motif: `L'offre de stage avec l'identifiant ${offreDeStage.identifiantSource || "undefined"} n'a pas pu être catégorisée`,
				});
			}
		} catch (e) {
			this.logger.error(e);
			offresDeStageEnErreur.push({
				contenuDeLOffre: offreDeStage,
				motif: (<Error>e).stack || (<Error>e).message,
			});
		}
	}

	async recupererMisesAJourDesOffres(nomDuFlux: string): Promise<UnJeune1Solution.OffreDeStage[]> {
		const temporaryFileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);
		const sourceFilePath = `${nomDuFlux}/${MinioHttpOffreDeStageRepository.NOM_DU_FICHIER_A_RECUPERER}${this.configuration.MINIO_TRANSFORMED_FILE_EXTENSION}`;

		try {
			await this.minioClient.fGetObject(
				this.configuration.MINIO_TRANSFORMED_BUCKET_NAME,
				sourceFilePath,
				localFileNameIncludingPath
			);
			const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
			return (<Array<UnJeune1Solution.AttributsDOffreDeStage>>JSON.parse(fileContent))
				.map((offreDeStage) => new UnJeune1Solution.OffreDeStage(offreDeStage));
		} catch (e) {
			throw new RecupererContenuErreur();
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}

	async recupererOffresExistantes(source: string): Promise<Array<UnJeune1Solution.OffreDeStageExistante>> {
		try {
			const offresDeStagesExistantesHttp = await this.httpClient.getAll(source);

			return offresDeStagesExistantesHttp.map((offreDeStageHttp) => new UnJeune1Solution.OffreDeStageExistante(
				offreDeStageHttp.id,
				offreDeStageHttp.attributes.identifiantSource,
				offreDeStageHttp.attributes.sourceUpdatedAt,
			));
		} catch (e) {
			throw new RecupererOffresExistantesErreur();
		}
	}

	async enregistrer(filePath: string, fileContent: string, fluxName: string): Promise<void> {
		const temporaryFileName = this.uuidGenerator.generate();
		const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);

		try {
			await this.fileSystemClient.write(localFileNameIncludingPath, fileContent);
			await this.minioClient.fPutObject(
				this.configuration.MINIO_RESULT_BUCKET_NAME,
				filePath,
				localFileNameIncludingPath
			);
		} catch (e) {
			throw new EcritureFluxErreur(fluxName);
		} finally {
			await this.fileSystemClient.delete(localFileNameIncludingPath);
		}
	}
}
