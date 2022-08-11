import { AxiosInstance } from "axios";
import sinon from "sinon";

import { expect } from "@test/configuration";
import { OffreDeStageFixtureBuilder } from "@test/chargement/fixture/offre-de-stage.fixture-builder";
import { OffreDeStageHttp, StrapiOffreDeStageHttpClient } from "@chargement/infrastructure/gateway/http.client";
import { StubbedCallableType, stubCallable } from "@salesforce/ts-sinon";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

const offreDeStageASupprimer = OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer();
const offreDeStageAMettreAJour = OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour();
const offreDeStageAPublier = OffreDeStageFixtureBuilder.buildOffreDeStageAPublier();
const urlVide = "";
const source = "source";
const offresHttp: Array<OffreDeStageHttp> = [{
	id: "Identifiant technique",
	attributes: {
		identifiantSource: "Identifiant source",
		sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
	},
}, {
	id: "Un autre identifiant technique",
	attributes: {
		identifiantSource: "Un autre identifiant source",
		sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
	},
}];

let axios: StubbedCallableType<AxiosInstance>;
let strapiOffreDeStageHttpClient: StrapiOffreDeStageHttpClient;

describe("StrapiHttpClientTest", () => {
	beforeEach(() => {
		axios = stubCallable<AxiosInstance>(sinon);
		axios.delete = sinon.stub();
		axios.post = sinon.stub();
		axios.put = sinon.stub();
		strapiOffreDeStageHttpClient = new StrapiOffreDeStageHttpClient(axios);
	});

	context("Lorsque je supprime une offre de stage", () => {
		it("je fais un appel HTTP delete avec le bon identifiant", async () => {
			await strapiOffreDeStageHttpClient.delete(
				new UnJeune1Solution.OffreDeStageASupprimer(
					offreDeStageASupprimer.recupererAttributs(),
					offreDeStageASupprimer.id
				)
			);

			expect(axios.delete).to.have.been.calledWith(`/${offreDeStageASupprimer.id}`);
		});
	});

	context("Lorsque je mets à jour une offre de stage", () => {
		it("je fais un appel HTTP avec le bon identifiant et le bon contenu", async () => {
			await strapiOffreDeStageHttpClient.put(
				new UnJeune1Solution.OffreDeStageAMettreAJour(
					offreDeStageAMettreAJour.recupererAttributs(),
					offreDeStageAMettreAJour.id
				)
			);

			expect(axios.put).to.have.been.calledWith(
				`/${offreDeStageAMettreAJour.id}`,
				{ data: offreDeStageAMettreAJour.recupererAttributs() },
			);
		});
	});

	context("Lorsque j'ajoute une nouvelle offre de stage", () => {
		it("je fais un appel HTTP avec le bon contenu", async () => {
			await strapiOffreDeStageHttpClient.post(
				new UnJeune1Solution.OffreDeStageAPublier(offreDeStageAPublier.recupererAttributs())
			);

			expect(axios.post).to.have.been.calledWith(
				urlVide,
				{ data: offreDeStageAPublier.recupererAttributs() },
			);
		});
	});

	context("Lorsque je récupère les offres de stage d'une source", () => {
		beforeEach(() => {
			axios.get.withArgs(urlVide, {
				params: {
					"filters[source][$eq]": encodeURI(source),
					"fields": StrapiOffreDeStageHttpClient.FIELDS_TO_RETRIEVE,
					"pagination[pageSize]": StrapiOffreDeStageHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
				},
			}).resolves({
				data: {
					data: offresHttp,
					meta: {
						pagination: {
							page: 1,
							pageSize: 100,
							pageCount: 1,
							total: 2,
						},
					},
				},
			});
		});

		it("je fais un appel HTTP avec la bonne source", async () => {
			const resultat = await strapiOffreDeStageHttpClient.getAll(source);

			expect(resultat).to.have.deep.members([{
				id: "Identifiant technique",
				attributes: {
					identifiantSource: "Identifiant source",
					sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
				},
			}, {
				id: "Un autre identifiant technique",
				attributes: {
					identifiantSource: "Un autre identifiant source",
					sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
				},
			}]);
			expect(axios.get).to.have.been.calledWith(urlVide, {
				params: {
					"filters[source][$eq]": encodeURI(source),
					"fields": StrapiOffreDeStageHttpClient.FIELDS_TO_RETRIEVE,
					"pagination[pageSize]": StrapiOffreDeStageHttpClient.OCCURENCIES_NUMBER_PER_PAGE,
				},
			});
		});
	});
});
