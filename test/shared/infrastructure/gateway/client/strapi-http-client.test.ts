import { AnnonceDeLogementBrute } from "@logements/indexation/service/types";
import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import {
	StrapiBodyResponse,
	StrapiHttpClient,
	StrapiResponse,
} from "@shared/infrastructure/gateway/client/strapi-http-client";
import { expect } from "@test/configuration";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/indexation/fixture/annonce-de-logement.fixture-builder";
import axios, { AxiosInstance } from "axios";
import nock from "nock";

const fieldsToRetrieve = "id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt";
const relationsToRetrieve = "localisation,imagesUrl";
const password = "s0m3p4$$w0rd";
const username = "someUs3r";
const endpoint = "/annonce-de-logement";
const source = "immojeune";

let dataPremierePage: Array<StrapiBodyResponse<AnnonceDeLogementBrute>>;
let dataSecondePage: Array<StrapiBodyResponse<AnnonceDeLogementBrute>>;
let axiosInstance: AxiosInstance;
let authenticationClient: AuthenticationClient;
let strapiHttpClient: StrapiHttpClient;

describe("StrapiHttpClientTest", () => {
	beforeEach(() => {
		dataPremierePage = [];
		dataSecondePage = [];
		axiosInstance = axios.create({
			baseURL: "http://127.0.0.1/api",
		});
		authenticationClient = new AuthenticationClient("http://127.0.0.1/api/auth", { username, password });
		strapiHttpClient = new StrapiHttpClient(axiosInstance, authenticationClient);

		for (let i = 1; i <= 100; i++) {
			dataPremierePage.push({ id: i, attributes: { ...AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementBrute({ id: `${i}` }) } });
		}

		for (let i = 101; i <= 200; i++) {
			dataSecondePage.push({ id: i, attributes: { ...AnnonceDeLogementFixtureBuilder.buildAnnonceDeLogementBrute({ id: `${i}` }) } });
		}
	});

	it("récupère et aggrège les données paginées", async () => {
		// Given
		const premiereReponseStrapi: StrapiResponse<AnnonceDeLogementBrute> = {
			data: dataPremierePage,
			meta: {
				pagination: {
					page: 1,
					pageSize: 100,
					pageCount: 2,
					total: 200,
				},
			},
		};

		const secondeReponseStrapi: StrapiResponse<AnnonceDeLogementBrute> = {
			data: dataSecondePage,
			meta: {
				pagination: {
					page: 2,
					pageSize: 100,
					pageCount: 2,
					total: 200,
				},
			},
		};


		nock("http://127.0.0.1/api")
			.post("/auth")
			.reply(200, "some token")
			.get("/annonce-de-logement?pagination[page]=1&filters[source][$eq]=immojeune&fields=id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt&pagination[pageSize]=100&sort=identifiantSource&populate=localisation,imagesUrl")
			.reply(200, premiereReponseStrapi)
			.get("/annonce-de-logement?pagination[page]=2&filters[source][$eq]=immojeune&fields=id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt&pagination[pageSize]=100&sort=identifiantSource&populate=localisation,imagesUrl")
			.reply(200, secondeReponseStrapi);

		// When
		const resultat = await strapiHttpClient.get<AnnonceDeLogementBrute>(endpoint, source, fieldsToRetrieve, relationsToRetrieve);

		// Then
		expect(resultat).to.have.deep.members([
			...dataPremierePage.map((data) => ({ ...data.attributes, id: data.id.toString() })),
			...dataSecondePage.map((data) => ({ ...data.attributes, id: data.id.toString() })),
		]);
	});
});
