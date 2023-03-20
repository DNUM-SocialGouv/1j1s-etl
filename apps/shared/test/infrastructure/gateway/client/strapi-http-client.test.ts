import axios, { AxiosInstance } from "axios";
import nock from "nock";

import { expect, sinon } from "@test/library";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import {
	StrapiBodyResponse,
	StrapiHttpClient,
	StrapiResponse,
} from "@shared/src/infrastructure/gateway/client/strapi-http-client";

const fieldsToRetrieve = "field1,field2";
const relationsToRetrieve = "relation1,relation2";
const password = "s0m3p4$$w0rd";
const username = "someUs3r";
const endpoint = "/ressource";
const source = "source";

let dataPremierePage: Array<StrapiBodyResponse<{ titre: string, id: number, field1: string, field2: boolean }>>;
let dataSecondePage: Array<StrapiBodyResponse<{ titre: string, id: number, field1: string, field2: boolean }>>;
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
			dataPremierePage.push({ id: i, attributes: { titre: "titre", id: i, field1: "field1", field2: true } });
		}

		for (let i = 101; i <= 200; i++) {
			dataSecondePage.push({ id: i, attributes: { titre: "titre", id: i, field1: "field10", field2: false } });
		}
	});

	it("récupère et aggrège les données paginées", async () => {
		// Given
		const premiereReponseStrapi: StrapiResponse<{ titre: string, id: number, field1: string, field2: boolean }> = {
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

		const secondeReponseStrapi: StrapiResponse<{ titre: string, id: number, field1: string, field2: boolean }> = {
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
			.get("/ressource?pagination[page]=1&filters[source][$eq]=source&fields=field1,field2&pagination[pageSize]=100&sort=identifiantSource&populate=relation1,relation2")
			.reply(200, premiereReponseStrapi)
			.get("/ressource?pagination[page]=2&filters[source][$eq]=source&fields=field1,field2&pagination[pageSize]=100&sort=identifiantSource&populate=relation1,relation2")
			.reply(200, secondeReponseStrapi);

		// When
		const resultat = await strapiHttpClient.get<{ titre: string, id: number, field1: string, field2: boolean }>(endpoint, fieldsToRetrieve, relationsToRetrieve, source);

		// Then
		expect(resultat).to.have.deep.members([
			...dataPremierePage.map((data) => ({ ...data.attributes, id: data.id })),
			...dataSecondePage.map((data) => ({ ...data.attributes, id: data.id })),
		]);
	});
	it("supprime une entrée", async () => {
		const spyAxios = sinon.spy(axiosInstance, "delete");
		const id = "1";

		nock("http://127.0.0.1/api")
			.post("/auth")
			.reply(200, "some token")
			.delete(`${endpoint}/${id}`)
			.reply(200);

		// When
		await strapiHttpClient.delete(endpoint, "1");

		// Then
		expect(spyAxios).to.have.been.calledWith(`${endpoint}/${id}`);
	});
});
