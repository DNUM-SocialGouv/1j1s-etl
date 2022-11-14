import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import nock from "nock";
import sinon, { spy } from "sinon";

import { AuthenticationClient } from "@stages/chargement/infrastructure/gateway/authentication.client";
import { expect } from "@test/configuration";
import { OffreDeStageFixtureBuilder } from "@test/stages/chargement/fixture/offre-de-stage.fixture-builder";
import { OffreDeStageHttp, StrapiOffreDeStageHttpClient } from "@stages/chargement/infrastructure/gateway/http.client";
import { UnJeune1Solution } from "@stages/chargement/domain/1jeune1solution";

const offreDeStageASupprimer = OffreDeStageFixtureBuilder.buildOffreDeStageASupprimer({}, "1");
const offreDeStageAMettreAJour = OffreDeStageFixtureBuilder.buildOffreDeStageAMettreAJour({}, "2");
const offreDeStageAPublier = OffreDeStageFixtureBuilder.buildOffreDeStageAPublier();
const offreDeStageUrl = "/offres-de-stage";
const source = "source";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
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


let spyOnDelete: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPost: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPut: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnAuthentication: sinon.SinonSpy<[axiosInstance: AxiosInstance], Promise<void>>;
let spyOnGet: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;

let axiosInstance: AxiosInstance;
let authClient: AuthenticationClient;
let strapiOffreDeStageHttpClient: StrapiOffreDeStageHttpClient;

describe("StrapiHttpClientTest", () => {
	beforeEach(() => {
		axiosInstance = axios.create({
			baseURL: "http://localhost:1337/api",
		});

		authClient = new AuthenticationClient(
			"/auth/local",
			{ username: "login@example.com", password: "somePassWord123" }
		);

		spyOnDelete = spy(axiosInstance, "delete");
		spyOnPost = spy(axiosInstance, "post");
		spyOnPut = spy(axiosInstance, "put");
		spyOnGet = spy(axiosInstance, "get");
		spyOnAuthentication = spy(authClient, "handleAuthentication");

		nock("http://localhost:1337/api")
			.post("/auth/local")
			.reply(200, { jwt })
			.delete(`/offres-de-stage/${offreDeStageASupprimer.id}`)
			.reply(200)
			.post("/offres-de-stage", { data: offreDeStageAPublier.recupererAttributs() })
			.reply(200)
			.put(`/offres-de-stage/${offreDeStageAMettreAJour.id}`)
			.reply(200)
			.get(`/offres-de-stage?filters[source][$eq]=${encodeURI(source)}&fields=identifiantSource,id,sourceUpdatedAt&pagination[pageSize]=100&sort=identifiantSource`)
			.reply(200, { data: offresHttp, meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 2 } } });

		strapiOffreDeStageHttpClient = new StrapiOffreDeStageHttpClient(axiosInstance, authClient, offreDeStageUrl);
	});

	context("Lorsque je supprime une offre de stage", () => {
		it("je fais un appel HTTP delete avec le bon identifiant", async () => {
			await strapiOffreDeStageHttpClient.delete(
				new UnJeune1Solution.OffreDeStageASupprimer(
					offreDeStageASupprimer.recupererAttributs(),
					offreDeStageASupprimer.id
				)
			);

			expect(spyOnDelete).to.have.been.calledOnce;
			expect(spyOnDelete).to.have.been.calledWith(`/offres-de-stage/${offreDeStageASupprimer.id}`);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
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

			expect(spyOnPut).to.have.been.calledWith(
				`/offres-de-stage/${offreDeStageAMettreAJour.id}`,
				{ data: offreDeStageAMettreAJour.recupererAttributs() },
			);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque j'ajoute une nouvelle offre de stage", () => {
		it("je fais un appel HTTP avec le bon contenu", async () => {
			await strapiOffreDeStageHttpClient.post(
				new UnJeune1Solution.OffreDeStageAPublier(offreDeStageAPublier.recupererAttributs())
			);

			expect(spyOnPost).to.have.been.calledWith(
				offreDeStageUrl,
				{ data: offreDeStageAPublier.recupererAttributs() },
			);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque je récupère les offres de stage d'une source", () => {
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
			expect(spyOnGet).to.have.been.calledWith(offreDeStageUrl, {
				params: {
					"filters[source][$eq]": encodeURI(source),
					"fields": "identifiantSource,id,sourceUpdatedAt",
					"pagination[pageSize]": 100,
					"sort": "identifiantSource",
				},
			});
		});
	});
});
