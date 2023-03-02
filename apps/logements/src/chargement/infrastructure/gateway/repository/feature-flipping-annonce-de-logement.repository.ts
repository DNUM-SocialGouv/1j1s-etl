import { UnJeune1Solution } from "@logements/src/chargement/domain/model/1jeune1solution";
import { HttpClient } from "@logements/src/chargement/infrastructure/gateway/client/http.client";
import { StorageClient } from "@logements/src/chargement/infrastructure/gateway/client/storage.client";
import {
	MinioHttpAnnonceDeLogementRepository,
} from "@logements/src/chargement/infrastructure/gateway/repository/minio-http-annonce-de-logement.repository";

import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";

export class FeatureFlippingAnnonceDeLogementRepository extends MinioHttpAnnonceDeLogementRepository {
	constructor(minioClient: StorageClient, httpClient: HttpClient, dateService: DateService, loggerStrategy: LoggerStrategy) {
		super(minioClient, httpClient, dateService, loggerStrategy);
	}

	public async recupererAnnoncesDeLogementReferencees(): Promise<Array<UnJeune1Solution.AnnonceDeLogementReferencee>> {
		return Promise.resolve([] as Array<UnJeune1Solution.AnnonceDeLogementReferencee>);
	}

	public async charger(
		annoncesDeLogement: Array<UnJeune1Solution.AnnonceDeLogement>,
		flowName: string,
	): Promise<Array<UnJeune1Solution.AnnonceDeLogementEnErreur>> {
		this.loggerStrategy.get(flowName).info("charger");
		let adsToBePublishedCount = 0;
		let adsToBeUpdatedCount = 0;
		let obsoleteAdsCount = 0;

		for (const ad of annoncesDeLogement) {
			if (ad instanceof UnJeune1Solution.NouvelleAnnonceDeLogement) {
				adsToBePublishedCount++;
			} else if (ad instanceof UnJeune1Solution.AnnonceDeLogementAMettreAJour) {
				adsToBeUpdatedCount++;
			} else if (ad instanceof UnJeune1Solution.AnnonceDeLogementObsolete) {
				obsoleteAdsCount++;
			}
		}

		this.loggerStrategy.get(flowName).debug(annoncesDeLogement.length);
		this.loggerStrategy.get(flowName).debug(`Nombre d'annonces de logement à publier : ${adsToBePublishedCount}`);
		this.loggerStrategy.get(flowName).debug(`Nombre d'annonces de logement à mettre à jour : ${adsToBeUpdatedCount}`);
		this.loggerStrategy.get(flowName).debug(`Nombre d'annonces de logement à supprimer : ${obsoleteAdsCount}`);

		return Promise.resolve([] as Array<UnJeune1Solution.AnnonceDeLogementEnErreur>);
	}

	public async preparerLeSuivi(): Promise<void> {
		return Promise.resolve();
	}
}
