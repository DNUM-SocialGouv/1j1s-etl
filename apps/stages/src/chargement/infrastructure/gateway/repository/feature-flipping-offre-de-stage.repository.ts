import { Client } from "minio";

import { Configuration } from "@stages/src/chargement/configuration/configuration";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { HttpClient } from "@stages/src/chargement/infrastructure/gateway/http.client";
import {
	MinioHttpOffreDeStageRepository,
} from "@stages/src/chargement/infrastructure/gateway/repository/minio-http-offre-de-stage.repository";
import { StagesChargementLoggerStrategy } from "@stages/src/chargement/configuration/logger-strategy";
import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class FeatureFlippingOffreDeStageRepository extends MinioHttpOffreDeStageRepository {
	constructor(
		configuration: Configuration,
		minioClient: Client,
		fileSystemClient: FileSystemClient,
		uuidGenerator: UuidGenerator,
		httpClient: HttpClient,
		loggerStrategy: StagesChargementLoggerStrategy
	) {
		super(configuration, minioClient, fileSystemClient, uuidGenerator, httpClient, loggerStrategy);
	}

	public override charger(source: string, offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Promise<Array<UnJeune1Solution.OffreDeStageEnErreur>> {
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

		this.loggerStrategy.get(source).debug(offresDeStages.length);
		this.loggerStrategy.get(source).debug(`Nombre d'offres de stage à publier : ${offresDeStageAPublierCount}`);
		this.loggerStrategy.get(source).debug(`Nombre d'offres de stage à mettre à jour : ${offresDeStageAMettreAJourCount}`);
		this.loggerStrategy.get(source).debug(`Nombre d'offres de stage à supprimer : ${offresDeStageASupprimerCount}`);

		return Promise.resolve([] as Array<UnJeune1Solution.OffreDeStageEnErreur>);
	}

	public override enregistrer(): Promise<void> {
		return Promise.resolve();
	}
}
