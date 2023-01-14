import { MeiliSearch } from "meilisearch";

import {
	AnnonceDeLogementAIndexer,
	AnnonceDeLogementBrute,
	AnnonceDeLogementRepository,
} from "@logements/indexation/service/types";
import { Configuration } from "@logements/indexation/configuration/configuration";
import { StrapiHttpClient } from "@shared/infrastructure/gateway/client/strapi-http-client";

export class HttpAnnonceDeLogementRepository implements AnnonceDeLogementRepository {
	private static readonly FIELDS_TO_RETRIEVE = "id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt";
	private static readonly INDEX = "annonces-de-logement";
	private static readonly RELATIONS_TO_RETRIEVE = "localisation,imagesUrl";

	constructor(
		private readonly configuration: Configuration,
		private readonly strapiHttpClient: StrapiHttpClient,
		private readonly meilisearchClient: MeiliSearch
	) {
	}

	public async indexer(annoncesDeLogement: Array<AnnonceDeLogementAIndexer>): Promise<void> {
		const index = await this.meilisearchClient.getIndex(HttpAnnonceDeLogementRepository.INDEX);
		await index.addDocumentsInBatches(annoncesDeLogement, this.configuration.SEARCH_ENGINE.BATCH_SIZE);
	}

	public recupererLesAnnonces(source: string): Promise<Array<AnnonceDeLogementBrute>> {
		return this.strapiHttpClient.get<AnnonceDeLogementBrute>(
			this.configuration.STRAPI.ENDPOINT,
			source,
			HttpAnnonceDeLogementRepository.FIELDS_TO_RETRIEVE,
			HttpAnnonceDeLogementRepository.RELATIONS_TO_RETRIEVE
		);
	}
}
