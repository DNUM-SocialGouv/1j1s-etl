import { MeilisearchClient } from "@shared/infrastructure/gateway/client/meilisearch.client";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { Index, MeiliSearch } from "meilisearch";

const indexName = "index-name";
let index: StubbedClass<Index>;
let meilisearch: StubbedClass<MeiliSearch>;
let meilisearchClient: MeilisearchClient;

describe("MeilisearchClientTest", () => {
	beforeEach(() => {
		index = stubClass(Index);
		meilisearch = stubClass(MeiliSearch);
		meilisearch.getIndex
			.withArgs(indexName)
			.resolves(index);
		meilisearchClient = new MeilisearchClient(meilisearch);
	});

	it("récupère un index", async () => {
		// When
		await meilisearchClient.index(indexName, []);

		// Then
		expect(meilisearch.getIndex).to.have.been.calledOnce;
		expect(meilisearch.getIndex).to.have.been.calledWith(indexName);
	});

	it("ajoute les documents par batch", async () => {
		// When
		await meilisearchClient.index<{ id: string }>(indexName, [{ id: "1" }, { id: "2" }]);

		// Then
		expect(index.addDocumentsInBatches).to.have.been.calledOnce;
		expect(index.addDocumentsInBatches).to.have.been.calledWith(
			[{ id: "1" }, { id: "2" }],
			5000
		);
	});
});
