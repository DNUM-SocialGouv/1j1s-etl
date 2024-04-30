import axios, { AxiosInstance } from "axios";
import nock from "nock";
import { expect, sinon } from "@test/library";

import { HttpClient, StrapiClient } from "@logements/src/chargement/infrastructure/gateway/client/http.client";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/chargement/fixture/annonce-de-logement.fixture-builder";
import {
	AnnonceDeLogementHttpFixtureBuilder,
} from "@logements/test/chargement/fixture/annonce-de-logement-http.fixture-builder";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

let axiosInstance: AxiosInstance;

const url = "http://localhost:1337/api";
const identifiantTechnique = "41";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

let authClient: AuthenticationClient;
let spyOnAuthentication;

describe("HttpClientTest", () => {
	context("Lorsque je souhaite communiquer avec le CMS Logements", () => {
		beforeEach(() => {
			const idTest = "41";
			axiosInstance = axios.create({
				baseURL: "http://localhost:1337/api",
			});

			authClient = new AuthenticationClient(
				"/auth/local",
				{ username: "login@example.com", password: "some_password_123" },
			);

			nock("http://localhost:1337/api")
				.post("/auth/local")
				.reply(200, { jwt })
				.get("?filters[source][$eq]=immojeune&fields[0]=identifiantSource&fields[1]=id&fields[2]=sourceUpdatedAt&pagination[pageSize]=100&sort=identifiantSource")
				.reply(200, {
					data: [AnnonceDeLogementHttpFixtureBuilder.build()],
					meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 2 } },
				})
				.post("")
				.reply(201, { data: AnnonceDeLogementHttpFixtureBuilder.build() })
				.put("/" + idTest)
				.reply(200, { data: AnnonceDeLogementHttpFixtureBuilder.build({ id: idTest }) })
				.delete("/" + idTest)
				.reply(204);
		});

		it("Je recupère les annonces publiées", async () => {
			const spyOnGet = sinon.spy(axiosInstance, "get");
			const repository: HttpClient = new StrapiClient(axiosInstance, url, authClient);

			const result = await repository.get("immojeune");

			expect(spyOnGet).to.have.been.calledWith(url, {
					params: {
						"filters[source][$eq]": "immojeune",
						"fields[0]": "identifiantSource",
						"fields[1]": "id",
						"fields[2]": "sourceUpdatedAt",
						"pagination[pageSize]": 100,
						sort: "identifiantSource",
					},
				},
			);

			expect(result).to.have.deep.members([AnnonceDeLogementHttpFixtureBuilder.build()]);
		});

		it("Je crée une nouvelle annonce de logement", async () => {
			const spyOnPost = sinon.spy(axiosInstance, "post");
			const repository: HttpClient = new StrapiClient(axiosInstance, url, authClient);

			spyOnAuthentication = sinon.spy(authClient, "handleAuthentication");

			await repository.post(AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce());

			expect(spyOnAuthentication).to.have.been.calledOnceWith(axiosInstance);
			expect(spyOnPost).to.have.been.calledWith(url, { data: AnnonceDeLogementFixtureBuilder.buildNouvelleAnnonce().recupererAttributs() });
		});

		it("Je mets à jour une nouvelle annonce de logement", async () => {
			const spyOnPut = sinon.spy(axiosInstance, "put");
			const repository: HttpClient = new StrapiClient(axiosInstance, url, authClient);

			spyOnAuthentication = sinon.spy(authClient, "handleAuthentication");

			await repository.put(AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({}, identifiantTechnique));

			expect(spyOnAuthentication).to.have.been.calledOnceWith(axiosInstance);
			expect(spyOnPut).to.have.been.calledWith(
				url + "/" + identifiantTechnique,
				{ data: AnnonceDeLogementFixtureBuilder.buildAnnonceAMettreAJour({ id: identifiantTechnique }).recupererAttributs() },
			);
		});

		it("Je supprime une annonce de logement", async () => {
			const spyOnDelete = sinon.spy(axiosInstance, "delete");
			const repository: HttpClient = new StrapiClient(axiosInstance, url, authClient);

			spyOnAuthentication = sinon.spy(authClient, "handleAuthentication");

			await repository.delete(AnnonceDeLogementFixtureBuilder.buildAnnonceASupprimer({}, identifiantTechnique));

			expect(spyOnAuthentication).to.have.been.calledOnceWith(axiosInstance);
			expect(spyOnDelete).to.have.been.calledWith(url + "/" + identifiantTechnique);
		});
	});
});
