import { Index, MeiliSearch, MeiliSearchApiError, Settings } from "meilisearch";

import { CreateIndexError, IndexNotFoundError } from "@shared/src/infrastructure/gateway/indexation.erreur";

export interface IndexingClient {
	configureIndex(indexName: string, settings: Settings): Promise<void>;
	createIndex(indexName: string): Promise<void>;
	index<T>(indexName: string, documents: Array<T>, batchSize: number): Promise<void>
}

export class MeilisearchIndexingClient implements IndexingClient {
	constructor(private readonly meilisearch: MeiliSearch) {
	}

	public async createIndex(indexName: string): Promise<void> {
		try {
			await this.getIndexIfExists(indexName);
		} catch (e) {
			if (e instanceof IndexNotFoundError) {
				await this.meilisearch.createIndex(indexName);
			} else {
				throw new CreateIndexError((<Error>e).message, indexName);
			}
		}
	}

	public async index<T>(indexName: string, documents: Array<T>, batchSize = 5000): Promise<void> {
		const index = await this.getIndexIfExists(indexName);
		await index.addDocumentsInBatches(
			documents,
			batchSize,
		);
	}

	public async configureIndex(indexName: string, settings: Settings): Promise<void> {
		const index = await this.getIndexIfExists(indexName);
		await index.updateSettings(settings);
	}

	private async getIndexIfExists(indexName: string): Promise<Index<unknown>> {
		try {
			return await this.meilisearch.getIndex(indexName);
		} catch (e) {
			if (e instanceof MeiliSearchApiError && e.httpStatus === 404) {
				throw new IndexNotFoundError(indexName);
			}
			throw e;
		}
	}
}
