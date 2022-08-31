import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";
import { Configuration } from "@configuration/configuration";
import { Client } from "minio";
import { FileSystemClient } from "@chargement/infrastructure/gateway/node-file-system.client";
import { UuidGenerator } from "@chargement/infrastructure/gateway/uuid.generator";
import { HttpClient } from "@chargement/infrastructure/gateway/http.client";
import { Logger } from "@shared/configuration/logger";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import OffreDeStageAPublier = UnJeune1Solution.OffreDeStageAPublier;
import OffreDeStageASupprimer = UnJeune1Solution.OffreDeStageASupprimer;
import OffreDeStageAMettreAJour = UnJeune1Solution.OffreDeStageAMettreAJour;

export class FeatureFlippingOffreDeStageRepository extends MinioHttpOffreDeStageRepository {
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
			if (offreDeStage instanceof OffreDeStageAPublier) {
				offresDeStageAPublierCount++;
			} else if (offreDeStage instanceof OffreDeStageAMettreAJour) {
				offresDeStageAMettreAJourCount++;
			} else if (offreDeStage instanceof OffreDeStageASupprimer) {
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
