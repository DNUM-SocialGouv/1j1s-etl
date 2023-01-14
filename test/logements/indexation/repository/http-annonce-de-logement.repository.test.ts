import { Index, MeiliSearch } from "meilisearch";


import { AnnonceDeLogementAIndexer } from "@logements/indexation/service/types";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/indexation/fixture/annonce-de-logement.fixture-builder";
import { Configuration } from "@logements/indexation/configuration/configuration";
import { Environment } from "@configuration/configuration";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { HttpAnnonceDeLogementRepository } from "@logements/indexation/repository/http-annonce-de-logement.repository";
import { StrapiHttpClient } from "@shared/infrastructure/gateway/client/strapi-http-client";

const source = "immojeune";
let configuration: Configuration;
let httpClient: StubbedClass<StrapiHttpClient>;
let meilisearchClient: StubbedClass<MeiliSearch>;
let index: StubbedClass<Index>;
let annonceDeLogementRepository: HttpAnnonceDeLogementRepository;

describe("HttpAnnonceDeLogementRepositoryTest", () => {
	beforeEach(() => {
		configuration = {
			DOMAINE: "Logements",
			FEATURE_FLIPPING: false,
			NODE_ENV: Environment.DEVELOPMENT,
			SEARCH_ENGINE: {
				API_KEY: "someKey",
				BATCH_SIZE: 5000,
				HOST: new URL("http://some.url"),
			},
			SENTRY: {
				DSN: "some dsn",
				PROJECT: "some project",
				RELEASE: "some release",
			},
			STRAPI: {
				AUTHENTICATION_URL: "http://127.0.0.1:1337/api/auth",
				ENDPOINT: "http://127.0.0.1:1337/api",
				PASSWORD: "somePa$$w0rd",
				USERNAME: "someUsername",
			},
		};

		httpClient = stubClass(StrapiHttpClient);
		meilisearchClient = stubClass(MeiliSearch);
		index = stubClass(Index);
		annonceDeLogementRepository = new HttpAnnonceDeLogementRepository(configuration, httpClient, meilisearchClient);
	});

	it("retourne les données renvoyées depuis un serveur distant", async () => {
		// Given
		httpClient.get.resolves([
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogement(),
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogement({ id: "2" }),
		]);

		// When
		const resultat = await annonceDeLogementRepository.recupererLesAnnonces(source);

		// Then
		expect(httpClient.get).to.have.been.calledOnceWith(
			"http://127.0.0.1:1337/api",
			"immojeune",
			"id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt",
			"localisation,imagesUrl",
		);
		expect(resultat).to.have.deep.members([
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogement(),
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogement({ id: "2" }),
		]);
	});

	it("indexe les annonces de logement", async () => {
		// Given
		const annoncesDeLogement: Array<AnnonceDeLogementAIndexer> = [
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementAIndexer(),
			AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementAIndexer({ id: "2" }),
		];
		meilisearchClient.getIndex.resolves(index);

		// When
		await annonceDeLogementRepository.indexer(annoncesDeLogement);

		// Then
		expect(meilisearchClient.getIndex).to.have.been.calledOnceWith("annonces-de-logement");
		expect(index.addDocumentsInBatches).to.have.been.calledOnceWith(
			[...annoncesDeLogement],
			configuration.SEARCH_ENGINE.BATCH_SIZE
		);
	});
});
