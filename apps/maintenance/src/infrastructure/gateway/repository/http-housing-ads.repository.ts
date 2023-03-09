import { AnnonceDeLogement } from "@maintenance/src/domain/model/annonce-de-logement";
import { AnnonceDeLogementRepository } from "@maintenance/src/domain/service/annonce-de-logement.repository";
import { StrapiConfiguration } from "@maintenance/src/infrastructure/configuration/configuration";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

export class HttpHousingAdsRepository implements AnnonceDeLogementRepository {
	constructor(
		private readonly strapiHttpClient: StrapiHttpClient,
		private readonly strapiConfiguration: StrapiConfiguration,
		private readonly logger: Logger
	) {
	}

	public async recuperer(flows: Array<string>): Promise<Array<AnnonceDeLogement>> {
		const housingAds: Array<AnnonceDeLogement> = [];

		for await (const flow of flows) {
			const flowHousingAds = await this.strapiHttpClient.get<AnnonceDeLogement>(
				this.strapiConfiguration.HOUSING_ADS_ENDPOINT, flow, "id", ""
			);
			housingAds.push(...flowHousingAds);
		}

		return housingAds;
	}

	public async supprimer(housingAds: Array<AnnonceDeLogement>): Promise<void> {
		for await (const housingAd of housingAds) {
			try {
				await this.strapiHttpClient.delete(this.strapiConfiguration.HOUSING_ADS_ENDPOINT, housingAd.id);
			} catch(error) {
				this.logger.error({
					msg: `The housing ad with id = ${housingAd.id} has not been deleted`,
					extra: { error: JSON.stringify(error) },
				});
			}
		}
	}
}
