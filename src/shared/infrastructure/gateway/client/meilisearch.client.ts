import { MeiliSearch } from "meilisearch";

export interface IndexingClient {
	index<T>(indexName: string, documents: Array<T>, batchSize: number): Promise<void>
}

export class MeilisearchClient implements IndexingClient {
	constructor(private readonly meilisearchClient: MeiliSearch) {
	}

	public async index<T>(indexName: string, documents: Array<T>, batchSize = 5000): Promise<void> {
		const index = await this.meilisearchClient.getIndex(indexName);
		await index.addDocumentsInBatches(
			documents,
			batchSize,
		);
	}
}
