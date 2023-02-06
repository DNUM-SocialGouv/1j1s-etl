import { MeilisearchIndexingClient } from "@shared/infrastructure/gateway/client/meilisearch-indexing.client";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { CreateIndexError } from "@shared/infrastructure/gateway/create-index.erreur";
import { Index, MeiliSearch, MeiliSearchApiError } from "meilisearch";

const indexName = "index-name";
let index: StubbedClass<Index>;
let meilisearch: StubbedClass<MeiliSearch>;
let meilisearchClient: MeilisearchIndexingClient;

describe("MeilisearchIndexingClientTest", () => {
	beforeEach(() => {
		index = stubClass(Index);
		meilisearch = stubClass(MeiliSearch);
		meilisearch.getIndex
			.withArgs(indexName)
			.resolves(index);
		meilisearchClient = new MeilisearchIndexingClient(meilisearch);
	});

	context("Lorsqu'un index existe déjà", () => {
		it("n'essaie pas de recréer l'index", async () => {
			// Given
			meilisearch.getIndex
				.withArgs(indexName)
				.resolves(stubClass(Index));

			// When
			await meilisearchClient.createIndex(indexName);

			// Then
			expect(meilisearch.createIndex).to.not.have.been.called;
		});
	});

	context("Lorsqu'un index n'existe pas", () => {
		it("crée un nouvel index", async () => {
			// Given
			meilisearch.getIndex
				.withArgs(indexName)
				.rejects(new MeiliSearchApiError({
					type: "invalid_request",
					code: "index_not_found",
					link: "https://docs.meilisearch.com/errors#index_not_found",
					message: "not found error",
				}, 404));

			// When
			await meilisearchClient.createIndex(indexName);

			// Then
			expect(meilisearch.createIndex).to.have.been.calledOnce;
			expect(meilisearch.createIndex).to.have.been.calledWith(indexName);
		});
	});

	context("Lorsqu'une erreur inattendue se produit lors de la récupération d'un index", () => {
		it("lance une erreur", async () => {
			// Given
			meilisearch.getIndex
				.withArgs(indexName)
				.rejects(new Error("Oops! Something went wrong !"));

			// When Then
			await expect(meilisearchClient.createIndex(indexName)).to.have.been.rejectedWith(
				CreateIndexError,
				`An error occured when trying to create index ${indexName}`
			);
		});
	});

	context("Lorsqu'on indexe des documents", () => {
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
				5000,
			);
		});
	});
});

