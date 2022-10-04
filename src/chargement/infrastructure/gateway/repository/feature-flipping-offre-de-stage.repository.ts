import { Client } from "minio";

import { Configuration } from "@chargement/configuration/configuration";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { HttpClient } from "@chargement/infrastructure/gateway/http.client";
import { LoggerStrategy } from "@chargement/configuration/logger-strategy";
import {
	MinioHttpOffreDeStageRepository,
} from "@chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";
import { UuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";

export class FeatureFlippingOffreDeStageRepository extends MinioHttpOffreDeStageRepository {
	constructor(
		configuration: Configuration,
		minioClient: Client,
		fileSystemClient: FileSystemClient,
		uuidGenerator: UuidGenerator,
		httpClient: HttpClient,
		loggerStrategy: LoggerStrategy
	) {
		super(configuration, minioClient, fileSystemClient, uuidGenerator, httpClient, loggerStrategy);
	}

	public charger(source: string, offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Promise<Array<UnJeune1Solution.OffreDeStageEnErreur>> {
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
		
<<<<<<< HEAD
		this.loggerStrategy.get(source).debug(offresDeStages.length);
		this.loggerStrategy.get(source).debug(`Nombre d'offres de stage à publier : ${offresDeStageAPublierCount}`);
		this.loggerStrategy.get(source).debug(`Nombre d'offres de stage à mettre à jour : ${offresDeStageAMettreAJourCount}`);
		this.loggerStrategy.get(source).debug(`Nombre d'offres de stage à supprimer : ${offresDeStageASupprimerCount}`);
	
=======
		if(offresDeStages.length !== 0){
			this.loggerStrategy.get(<string>(offresDeStages[0].source)).debug(offresDeStages.length);
			this.loggerStrategy.get(<string>(offresDeStages[0].source)).debug(`Nombre d'offres de stage à publier : ${offresDeStageAPublierCount}`);
			this.loggerStrategy.get(<string>(offresDeStages[0].source)).debug(`Nombre d'offres de stage à mettre à jour : ${offresDeStageAMettreAJourCount}`);
			this.loggerStrategy.get(<string>(offresDeStages[0].source)).debug(`Nombre d'offres de stage à supprimer : ${offresDeStageASupprimerCount}`);
		}

>>>>>>> 7fbc845 (fix(load): update feature flipping)
		return Promise.resolve([]);
	}

	public enregistrer(): Promise<void> {
		return Promise.resolve();
	}
}
