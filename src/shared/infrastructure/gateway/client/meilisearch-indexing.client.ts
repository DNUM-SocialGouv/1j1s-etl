import { CreateIndexError } from "@shared/infrastructure/gateway/create-index.erreur";
import { MeiliSearch, MeiliSearchApiError } from "meilisearch";

export interface IndexingClient {
	createIndex(indexName: string): Promise<void>;
	index<T>(indexName: string, documents: Array<T>, batchSize: number): Promise<void>
}

export class MeilisearchIndexingClient implements IndexingClient {
	constructor(private readonly meilisearch: MeiliSearch) {
	}

	public async createIndex(indexName: string): Promise<void> {
		try {
			await this.meilisearch.getIndex(indexName);
		} catch (e) {
			if (e instanceof MeiliSearchApiError && e.httpStatus === 404) {
				await this.meilisearch.createIndex(indexName);
			} else {
				throw new CreateIndexError((<Error>e).message, indexName);
			}
		}
	}

	public async index<T>(indexName: string, documents: Array<T>, batchSize = 5000): Promise<void> {
		const index = await this.meilisearch.getIndex(indexName);
		await index.addDocumentsInBatches(
			documents,
			batchSize,
		);
	}
}
