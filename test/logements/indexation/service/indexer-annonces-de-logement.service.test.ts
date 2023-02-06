import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/indexation/fixture/annonce-de-logement.fixture-builder";
import { Configuration } from "@logements/indexation/configuration/configuration";
import { expect, sinon, StubbedType, stubInterface } from "@test/configuration";
import { IndexerAnnoncesDeLogement } from "@logements/indexation/service/indexer-annonces-de-logement.service";
import { IndexingClient } from "@shared/infrastructure/gateway/client/meilisearch-indexing.client";
import { HttpClient } from "@shared/infrastructure/gateway/client/strapi-http-client";

const fieldsToRetrieve = "id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt";
const relationsToRetrieve = "localisation,imagesUrl";
const indexName = "annonces-de-logement";
let source: string;
let configuration: StubbedType<Configuration>;
let indexingClient: StubbedType<IndexingClient>;
let httpClient: StubbedType<HttpClient>;
let indexerAnnoncesDeLogement: IndexerAnnoncesDeLogement;

describe("IndexerAnnoncesDeLogement", () => {
	beforeEach(() => {
		configuration = stubInterface(sinon);
		source = "immojeune";
		indexingClient = stubInterface<IndexingClient>(sinon);
		httpClient = stubInterface<HttpClient>(sinon);
		indexerAnnoncesDeLogement = new IndexerAnnoncesDeLogement(
			indexingClient,
			httpClient,
			configuration,
		);
	});

	it("indexe les annonces de logement", async () => {
		// Given
		const annoncesDeLogementAIndexer = [AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementAIndexer()];
		httpClient
			.get
			.withArgs(configuration.STRAPI.ENDPOINT, source, fieldsToRetrieve, relationsToRetrieve)
			.resolves([
				AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementBrute(),
			]);
		indexingClient
			.index
			.withArgs(indexName, annoncesDeLogementAIndexer, 5000)
			.resolves();

		// When
		await indexerAnnoncesDeLogement.executer(source);

		// Then
		expect(httpClient.get).to.have.been.calledOnce;
		expect(indexingClient.index).to.have.calledOnce;
	});
});
