import { OffreDeStage } from "@maintenance/src/domain/model/offre-de-stage";
import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";
import { StrapiConfiguration } from "@maintenance/src/infrastructure/configuration/configuration";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

export class HttpInternshipRepository implements OffreDeStageRepository {
	constructor(
		private readonly strapiConfiguration: StrapiConfiguration,
		private readonly strapiHttpClient: StrapiHttpClient,
		private readonly logger: Logger,
	) {
	}

	public async recuperer(flows: Array<string>): Promise<Array<OffreDeStage>> {
		const internships: Array<OffreDeStage> = [];
		for (const flow of flows) {
			internships.push(...(await this.strapiHttpClient.get<OffreDeStage>(this.strapiConfiguration.INTERNSHIP_ENDPOINT, flow, "id", "")));
		}
		return internships;
	}

	public async supprimer(internships: Array<OffreDeStage>): Promise<void> {
		for await (const internship of internships) {
			try {
				await this.strapiHttpClient.delete(this.strapiConfiguration.INTERNSHIP_ENDPOINT, internship.id);
			} catch (error) {
				this.logger.error({
					msg: `The internship with id = ${internship.id} has not been deleted`,
					extra: { error: JSON.stringify(error) },
				});
			}
		}
	}
}
