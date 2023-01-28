import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import {
	evenement1Le24Novembre,
	evenementDejaCharge1Le24Novembre,
	evenementDejaCharge2Le24Novembre, EvenementUnJeuneUneSolutionFixtureBuilder,
} from "@test/evenements/fixture/evenements-un-jeune-une-solution.fixture";
import { expect, nock, spy } from "@test/configuration";
import {
	StrapiEvenementHttpClient,
} from "@evenements/chargement/infrastructure/gateway/client/strapi-evenement-http-client";
import { UnJeuneUneSolution } from "@evenements/chargement/domain/model/1jeune1solution";

const source = "tous-mobilises";
const url = "evenements";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const evenementAMettreAJour: UnJeuneUneSolution.EvenementAMettreAJour = {
	id: 1,
	...evenement1Le24Novembre,
};

const evenementAAJouter: UnJeuneUneSolution.EvenementAAjouter = evenement1Le24Novembre;

let spyOnDelete: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPost: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPut: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnAuthentication: sinon.SinonSpy<[axiosInstance: AxiosInstance], Promise<void>>;
let spyOnGet: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;

let axiosInstance: AxiosInstance;
let authClient: AuthenticationClient;
let strapiEvenementHttpClient: StrapiEvenementHttpClient;

describe("StrapiEvenementHttpClientTest", () => {
	beforeEach(() => {
		axiosInstance = axios.create({
			baseURL: "http://localhost:1337/api",
		});

		authClient = new AuthenticationClient(
			"/auth/local",
			{ username: "login@example.com", password: "somePassWord123" },
		);

		spyOnDelete = spy(axiosInstance, "delete");
		spyOnPost = spy(axiosInstance, "post");
		spyOnPut = spy(axiosInstance, "put");
		spyOnGet = spy(axiosInstance, "get");
		spyOnAuthentication = spy(authClient, "handleAuthentication");

		nock("http://localhost:1337/api")
			.post("/auth/local")
			.reply(200, { jwt })
			.delete("/evenements/1")
			.reply(200)
			.post("/evenements", { data: { ...evenementAAJouter } })
			.reply(200)
			.put("/evenements/1", { data: { ...evenementAMettreAJour } })
			.reply(200)
			.get(`/evenements?filters[source][$eq]=${encodeURI("tous-mobilises")}&pagination[pageSize]=100`)
			.reply(200, { "data":[{ "id":1,"attributes":{ "description":"description","idSource":"272709","lieuEvenement":"lieuEvenement","modaliteInscription":"modaliteInscription","online":false,"organismeOrganisateur":"organismeOrganisateur","titreEvenement":"titreEvenement","typeEvenement":"typeEvenement","source":"tous-mobilises","slug":"272709","createdAt":"2022-12-02T10:04:05.112Z","updatedAt":"2022-12-02T10:50:27.577Z","publishedAt":"2022-12-02T10:04:06.274Z","dateDebut":"2022-11-24T08:00:00.000Z","dateFin":"2022-11-24T11:00:00.000Z" } },{ "id":2,"attributes":{ "description":"description","idSource":"272510","lieuEvenement":"lieuEvenement","modaliteInscription": "modaliteInscription","online": false,"organismeOrganisateur":"organismeOrganisateur","titreEvenement":"titreEvenement","typeEvenement":"typeEvenement","source":"tous-mobilises","slug":"272510","createdAt":"2022-12-02T10:51:54.650Z","updatedAt":"2022-12-02T11:08:39.622Z","publishedAt":"2022-12-02T11:08:39.618Z","dateDebut":"2022-11-24T07:30:00.000Z","dateFin":"2022-11-24T15:15:00.000Z" } }],"meta":{ "pagination":{ "page":1,"pageSize":25,"pageCount":1,"total":2 } } });

		strapiEvenementHttpClient = new StrapiEvenementHttpClient(axiosInstance, authClient, url);
	});

	context("Lorsque je supprime une evenement", () => {
		it("je fais un appel HTTP delete avec le bon identifiant", async () => {
			await strapiEvenementHttpClient.delete(EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementASupprimer({ id: 1, ...evenement1Le24Novembre }));

			expect(spyOnDelete).to.have.been.calledOnce;
			expect(spyOnDelete).to.have.been.calledWith("evenements/1");

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque je mets à jour une evenement", () => {
		it("je fais un appel HTTP avec le bon identifiant et le bon contenu", async () => {
			await strapiEvenementHttpClient.put(EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementAMettreAJour({ id: 1, ...evenement1Le24Novembre }));

			expect(spyOnPut).to.have.been.calledWith(
				"evenements/1",
				{ data: EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementAMettreAJour({ id: 1, ...evenement1Le24Novembre }) },
			);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque j'ajoute un nouveau evenement", () => {
		it("je fais un appel HTTP avec le bon contenu", async () => {
			await strapiEvenementHttpClient.post(evenement1Le24Novembre);

			expect(spyOnPost).to.have.been.calledWith(
				url,
				{ data: evenement1Le24Novembre },
			);

			expect(spyOnAuthentication).to.have.been.calledOnce;
			expect(spyOnAuthentication).to.have.been.calledWith(axiosInstance);
		});
	});

	context("Lorsque je récupère les évenements d'une source", () => {
		it("je fais un appel HTTP avec la bonne source", async () => {
			const resultat = await strapiEvenementHttpClient.getAll(source);

			expect(resultat).to.have.deep.members([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre]);
			expect(spyOnGet).to.have.been.calledWith("evenements", {
				params: {
					"filters[source][$eq]": encodeURI(source),
					"pagination[pageSize]": 100,
				},
			});
		});
	});
});
