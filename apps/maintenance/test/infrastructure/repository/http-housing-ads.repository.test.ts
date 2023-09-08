import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { StrapiConfiguration } from "@maintenance/src/infrastructure/configuration/configuration";
import {
	HttpHousingAdsRepository,
} from "@maintenance/src/infrastructure/gateway/repository/http-housing-ads.repository";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

const flows = ["immojeune", "studapart"];
const error = new Error("Oops something went wrong!");

let strapiHttpClient: StubbedClass<StrapiHttpClient>;
let strapiConfiguration: StubbedType<StrapiConfiguration>;
let logger: StubbedType<Logger>;
let housingAdsRepository: HttpHousingAdsRepository;

describe("HttpHousingAdsRepositoryTest", () => {
	beforeEach(() => {
		strapiHttpClient = stubClass(StrapiHttpClient);
		strapiConfiguration = stubInterface<StrapiConfiguration>(sinon);
		logger = stubInterface<Logger>(sinon);

		strapiConfiguration.HOUSING_ADS_ENDPOINT = "/annonces-de-logement";

		housingAdsRepository = new HttpHousingAdsRepository(strapiHttpClient, strapiConfiguration, logger);
	});

	context("Lorsque je récupère des annonces de logement", () => {
		it("je récupère les annonces pour chaque flux", async () => {
			// Given
			strapiHttpClient
				.get
				.withArgs(strapiConfiguration.HOUSING_ADS_ENDPOINT, ["id"], "", "immojeune")
				.resolves([{ id: "1" }, { id: "2" }, { id: "3" }]);

			strapiHttpClient
				.get
				.withArgs(strapiConfiguration.HOUSING_ADS_ENDPOINT, ["id"], "", "studapart")
				.resolves([{ id: "4" }, { id: "5" }]);

			// When
			const actual = await housingAdsRepository.recuperer(flows);

			// Then
			const expected = [
				{ id: "1" },
				{ id: "2" },
				{ id: "3" },
				{ id: "4" },
				{ id: "5" },
			];
			expect(strapiHttpClient.get).to.have.been.calledTwice;
			expect(actual).to.have.deep.members(expected);
		});
	});

	context("Lorsque je supprime des annonces de logement", () => {
		context("et qu'il n'y a aucune erreur", () => {
			it("supprime des annonces de logement", async () => {
				// Given
				const housingAds = [
					{ id: "1" },
					{ id: "2" },
					{ id: "3" },
				];

				// When
				await housingAdsRepository.supprimer(housingAds);

				// Then
				expect(strapiHttpClient.delete.getCall(0).args).to.have.deep.members([strapiConfiguration.HOUSING_ADS_ENDPOINT, "1"]);
				expect(strapiHttpClient.delete.getCall(1).args).to.have.deep.members([strapiConfiguration.HOUSING_ADS_ENDPOINT, "2"]);
				expect(strapiHttpClient.delete.getCall(2).args).to.have.deep.members([strapiConfiguration.HOUSING_ADS_ENDPOINT, "3"]);
			});
		});

		context("et qu'il y a une erreur", () => {
			it("supprime les annonces de logement qui ne sont pas en erreur", async () => {
				// Given
				const housingAds = [
					{ id: "1" },
					{ id: "2" },
					{ id: "3" },
				];
				strapiHttpClient
					.delete
					.withArgs(strapiConfiguration.HOUSING_ADS_ENDPOINT, "2")
					.rejects(error);

				// When
				await housingAdsRepository.supprimer(housingAds);

				// Then
				expect(strapiHttpClient.delete.getCall(2).args).to.have.deep.members([strapiConfiguration.HOUSING_ADS_ENDPOINT, "3"]);
			});

			it("log les annonces de logement qui sont tombées en erreur", async () => {
				// Given
				const housingAds = [
					{ id: "1" },
					{ id: "2" },
					{ id: "3" },
				];

				strapiHttpClient
					.delete
					.withArgs(strapiConfiguration.HOUSING_ADS_ENDPOINT, "2")
					.rejects(error);

				// When
				await housingAdsRepository.supprimer(housingAds);

				// Then
				expect(logger.error).to.have.been.calledWith({
					msg: "The housing ad with id = 2 has not been deleted",
					extra: { error: JSON.stringify(error) },
				});
			});
		});
	});
});
