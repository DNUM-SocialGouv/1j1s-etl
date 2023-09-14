import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { Configuration } from "@logements/src/indexation/infrastructure/configuration/configuration";
import {
	AnnonceDeLogementStrapiMeilisearchRepository,
} from "@logements/src/indexation/infrastructure/gateway/repository/annonce-de-logement-strapi-meilisearch.repository";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/indexation/fixture/annonce-de-logement.fixture-builder";

import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi/strapi-http-client";

const fieldsToRetrieve = ["id","slug","titre","dateDeDisponibilite","devise","prix","prixHT","surface","surfaceMax","type","url","sourceUpdatedAt"];
const relationsToRetrieve = "localisation,imagesUrl";
const source = "une-source";
let configuration: StubbedType<Configuration>;
let strapiHttpClient: StubbedClass<StrapiHttpClient>;
let annonceDeLogementRepository: AnnonceDeLogementStrapiMeilisearchRepository;

describe("AnnonceDeLogementStrapiMeilisearchRepositoryTest", () => {
	it("récupère les annonces de logement d'une source", async () => {
		// Given
		strapiHttpClient = stubClass(StrapiHttpClient);
		configuration = stubInterface(sinon);
		configuration.STRAPI.ENDPOINT = "https://some.url.com";
		const annonceDeLogementStrapi = {
			id: "1",
			attributes: {
				...AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementBrute().getSnapshot(),
				id: undefined,
			},
		};
		delete annonceDeLogementStrapi.attributes.id;
		strapiHttpClient.get.withArgs(
			"https://some.url.com",
			fieldsToRetrieve,
			relationsToRetrieve,
			source,
		).resolves([annonceDeLogementStrapi]);
		annonceDeLogementRepository = new AnnonceDeLogementStrapiMeilisearchRepository(configuration, strapiHttpClient);

		// When
		const actual = await annonceDeLogementRepository.recupererLesAnnonces(source);

		// Then
		expect(actual).to.have.deep.members([AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementBrute()]);
		expect(strapiHttpClient.get).to.have.been.calledOnce;
	});

	context("Lorsque les offres de stage n'ont pas le bon format", () => {
		it.skip("lance une erreur", () => {
			expect(true).to.be.false;
		});
	});
});
