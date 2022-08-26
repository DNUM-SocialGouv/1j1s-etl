import { Client } from "minio";

import { Configuration } from "@chargement/configuration/configuration";
import { FileSystemClient } from "@chargement/infrastructure/gateway/node-file-system.client";
import { HttpClient } from "@chargement/infrastructure/gateway/http.client";
import { Logger } from "@shared/configuration/logger";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";
import { UuidGenerator } from "@chargement/infrastructure/gateway/uuid.generator";

export class FeatureFlippingOffreDeStageRepository extends MinioHttpOffreDeStageRepository {
	static LOCAL_FILE_PATH = "./tmp/";
	static NOM_DU_FICHIER_A_RECUPERER = "latest";


	constructor(
		configuration: Configuration,
		minioClient: Client,
		fileSystemClient: FileSystemClient,
		uuidGenerator: UuidGenerator,
		httpClient: HttpClient,
		logger: Logger
	) {
		super(configuration, minioClient, fileSystemClient, uuidGenerator, httpClient, logger);
	}

	charger(offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Promise<Array<UnJeune1Solution.OffreDeStageEnErreur>> {
		let offresDeStageAPublierCount = 0;
		let offresDeStageAMettreAJourCount = 0;
		let offresDeStageASupprimerCount = 0;

		for (const offreDeStage of offresDeStages) {
			if (offreDeStage instanceof UnJeune1Solution.OffreDeStageAPublier) {
				offresDeStageAPublierCount++;
			} else if (offreDeStage instanceof UnJeune1Solution.OffreDeStageAMettreAJour) {
				offresDeStageAMettreAJourCount++;
			} else if (offreDeStage instanceof UnJeune1Solution.OffreDeStageASupprimer) {
				offresDeStageASupprimerCount++;
			}
		}
		this.logger.debug(offresDeStages.length);
		this.logger.debug(`Nombre d'offres de stage à publier : ${offresDeStageAPublierCount}`);
		this.logger.debug(`Nombre d'offres de stage à mettre à jour : ${offresDeStageAMettreAJourCount}`);
		this.logger.debug(`Nombre d'offres de stage à supprimer : ${offresDeStageASupprimerCount}`);

		return Promise.resolve([]);
	}

	enregistrer(): Promise<void> {
		return Promise.resolve();
	}
}
