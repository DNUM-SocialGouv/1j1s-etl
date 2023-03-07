import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { OffreDeStage } from "@maintenance/src/domain/model/offre-de-stage";
import { StrapiConfiguration } from "@maintenance/src/infrastructure/configuration/configuration";
import { HttpInternshipRepository } from "@maintenance/src/infrastructure/gateway/repository/http-internship.repository";
import { OffreDeStageFixtureBuilder } from "@maintenance/test/fixture/offre-de-stage.fixture-builder";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";

let strapiConfiguration: StubbedType<StrapiConfiguration>;
let httpRepository: HttpInternshipRepository;
let strapiHttpClient: StubbedClass<StrapiHttpClient>;
let logger: StubbedType<Logger>;

describe("HttpInternshipRepositoryTest", () => {
	beforeEach(() => {
		strapiConfiguration = stubInterface<StrapiConfiguration>(sinon);
		strapiConfiguration.INTERNSHIP_ENDPOINT = "offres-de-stage";
		strapiHttpClient = stubClass(StrapiHttpClient);
		logger = stubInterface<Logger>(sinon);

		httpRepository = new HttpInternshipRepository(strapiConfiguration, strapiHttpClient, logger);
	});
	context("Lorsque je souhaite récupérer les offres de stage", () => {
		it("je récupère les offres de stage", async () => {
			// Given
			const offreDeStageJobteaser: Array<OffreDeStage> = [
				OffreDeStageFixtureBuilder.build("1"),
			];
			const offreDeStageStagefrCompresse: Array<OffreDeStage> = [
				OffreDeStageFixtureBuilder.build("2"),
			];
			const offreDeStageStagefrDecompresse: Array<OffreDeStage> = [
				OffreDeStageFixtureBuilder.build("3"),
			];
			const flows = ["jobteaser", "stagefr-compresse", "stagefr-decompresse"];

			strapiHttpClient.get.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, flows[0], "id", "").resolves(offreDeStageJobteaser);
			strapiHttpClient.get.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, flows[1], "id", "").resolves(offreDeStageStagefrCompresse);
			strapiHttpClient.get.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, flows[2], "id", "").resolves(offreDeStageStagefrDecompresse);

			// When
			const result = await httpRepository.recuperer(flows);

			// Then
			expect(result).to.have.deep.members([...offreDeStageJobteaser, ...offreDeStageStagefrCompresse, ...offreDeStageStagefrDecompresse]);
		});
	});
	context("Lorsque je supprime les offres de stage", () => {
		context("et que j'ai des erreurs", () => {
			it("je supprime les offres de stage qui ne sont pas en erreur", async () => {
				// Given
				const internships: Array<OffreDeStage> = [
					OffreDeStageFixtureBuilder.build("1"),
					OffreDeStageFixtureBuilder.build("2"),
				];
				strapiHttpClient.delete.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, "1").rejects(new Error("something went wrong"));
				strapiHttpClient.delete.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, "2").resolves();

				// When
				await httpRepository.supprimer(internships);

				// Then
				expect(strapiHttpClient.delete.getCall(1).args).to.have.deep.members([strapiConfiguration.INTERNSHIP_ENDPOINT, "2"]);
			});
			it("je log les offres de stage en erreur", async () => {
				// Given
				const internships: Array<OffreDeStage> = [
					OffreDeStageFixtureBuilder.build("1"),
					OffreDeStageFixtureBuilder.build("2"),
				];
				const error = new Error("something went wrong");

				strapiHttpClient.delete.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, "1").rejects(error);
				strapiHttpClient.delete.withArgs(strapiConfiguration.INTERNSHIP_ENDPOINT, "2").resolves();

				// When
				await httpRepository.supprimer(internships);

				// Then
				expect(logger.error).to.have.been.calledWith({
					msg: "The internship with id = 1 has not been deleted",
					extra: { error: JSON.stringify(error) },
				});
			});
		});
		context("et qu'il n'y a pas d'erreur", () => {
			it("je supprime les offres de stage", async () => {
				// Given
				const internships: Array<OffreDeStage> = [
					OffreDeStageFixtureBuilder.build("1"),
					OffreDeStageFixtureBuilder.build("2"),
				];

				// When
				await httpRepository.supprimer(internships);

				// Then
				expect(strapiHttpClient.delete.getCall(0).args).to.have.deep.members([strapiConfiguration.INTERNSHIP_ENDPOINT, "1"]);
				expect(strapiHttpClient.delete.getCall(1).args).to.have.deep.members([strapiConfiguration.INTERNSHIP_ENDPOINT, "2"]);
				expect(logger.error).to.not.have.been.called;
			});
		});
	});
});
