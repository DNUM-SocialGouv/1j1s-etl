import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { expect, nock, spy } from "@test/library";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";
import {
	OffreDeStageHttp,
	StrapiOffreDeStageHttpClient,
} from "@stages/src/chargement/infrastructure/gateway/client/http.client";
import {
	FormationsInitialesFixtureBuilder
} from '@formations-initiales/test/chargement/fixture/formations-initiales-builder';

const formationInitialeASupprimer = FormationsInitialesFixtureBuilder.buildFormationsInitialesASupprimer({}, "1");
const formationInitialeASauvegarder = FormationsInitialesFixtureBuilder.buildFormationsInitialesASauvegarder();
const formationInitialeUrl = "/formation-initiale-details";
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

describe("StrapiFormationsInitialesHttpClient", () => {
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
		spyOnGet = spy(axiosInstance, "get");
		spyOnAuthentication = spy(authClient, "handleAuthentication");

		nock("http://localhost:1337/api")
			.post("/auth/local")
			.reply(200, { jwt })
			.delete(`/formation-initiale-details/${formationInitialeASupprimer.id}`)
			.reply(200)
			.post("/formation-initiale-details", { data: formationInitialeASauvegarder.recupererAttributs() })
			.reply(200)
			.get(`/formation-initiale-details?filters&fields=identifiantSource,id,sourceUpdatedAt&pagination[pageSize]=100&sort=identifiantSource`)
			.reply(200, { data: offresHttp, meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 2 } } });

		strapiOffreDeStageHttpClient = new StrapiOffreDeStageHttpClient(axiosInstance, authClient, formationInitialeUrl);
	});
});
