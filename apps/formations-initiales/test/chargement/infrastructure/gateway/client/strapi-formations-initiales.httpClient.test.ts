import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { expect, nock, sinon, spy } from "@test/library";

import {
	FormationInitialeStrapiExtrait,
	StrapiFormationsInitialesHttpClient,
} from "@formations-initiales/src/chargement/infrastructure/gateway/client/strapi-formations-initiales.httpClient";
import {
  FormationInitialeFixtureBuilder,
} from "@formations-initiales/test/chargement/fixture/formation-initiale-fixture.builder";
import {
  FormationInitialeStrapiFixtureBuilder,
} from "@formations-initiales/test/chargement/fixture/formations-initiales-http.fixture-builder";

import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";

const formationInitialeASupprimer = FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer({}, "1");
const formationInitialeASauvegarder = FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder();
const formationInitialeUrl = "/formation-initiale-details";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const formationsInitialesHttp: Array<FormationInitialeStrapiExtrait> = [
  FormationInitialeStrapiFixtureBuilder.build(),
  FormationInitialeStrapiFixtureBuilder.build({
    id: "1",
    attributes: {
      identifiant: "identifiant 1",
    },
  }),
];

let spyOnDelete: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnPost: sinon.SinonSpy<[url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;
let spyOnGet: sinon.SinonSpy<[url: string, config?: AxiosRequestConfig<unknown> | undefined], Promise<unknown>>;

let axiosInstance: AxiosInstance;
let authClient: AuthenticationClient;
let strapiFormationsInitialesHttpClient: StrapiFormationsInitialesHttpClient;

const username = "login@example.com";
const password = "somePassWord123";

describe("StrapiFormationsInitialesHttpClient", () => {
  beforeEach(() => {
    axiosInstance = axios.create({
      baseURL: "http://localhost:1337/api",
    });

    authClient = new AuthenticationClient(
      "/auth/local",
      { username, password },
    );

    spyOnDelete = spy(axiosInstance, "delete");
    spyOnPost = spy(axiosInstance, "post");
    spyOnGet = spy(axiosInstance, "get");

    nock("http://localhost:1337/api")
      .post("/auth/local")
      .reply(200, { jwt })
      .get("/formation-initiale-details?fields[0]=identifiant&fields[1]=id&pagination[page]=1&pagination[pageSize]=100&sort=identifiant")
      .reply(200, {
        data: [formationsInitialesHttp[0]],
        meta: { pagination: { page: 1, pageSize: 1, pageCount: 2, total: 2 } },
      })
      .get("/formation-initiale-details?fields[0]=identifiant&fields[1]=id&pagination[page]=2&pagination[pageSize]=100&sort=identifiant")
      .reply(200, {
        data: [formationsInitialesHttp[1]],
        meta: { pagination: { page: 2, pageSize: 1, pageCount: 2, total: 2 } },
      })
      .delete(`/formation-initiale-details/${formationInitialeASupprimer.id}`)
      .reply(200)
      .post("/formation-initiale-details", { data: formationInitialeASauvegarder.recupererAttributs() })
      .reply(200);

    strapiFormationsInitialesHttpClient = new StrapiFormationsInitialesHttpClient(axiosInstance, authClient, formationInitialeUrl);
  });

  context("Lorsque je récupère les formations initiales", () => {
    context("Lorsque que le CMS retourne 2 pages de formations initiales", () => {
      it("je fais un appel HTTP avec la bonne URL", async () => {
        // When
        await strapiFormationsInitialesHttpClient.getAll();

        // Then
        expect(spyOnGet).to.have.been.calledTwice;
        expect(spyOnGet.getCall(0).args).to.deep.equal([
          "/formation-initiale-details",
          {
            params: {
              "fields[0]": "identifiant",
              "fields[1]": "id",
              "pagination[page]": 1,
              "pagination[pageSize]": 100,
              sort: "identifiant",
            },
          },
        ]);
        expect(spyOnGet.getCall(1).args).to.deep.equal([
          "/formation-initiale-details",
          {
            params: {
              "fields[0]": "identifiant",
              "fields[1]": "id",
              "pagination[page]": 2,
              "pagination[pageSize]": 100,
              sort: "identifiant",
            },
          },
        ]);
      });
      it("retourne les formations initiales", async () => {
        // When
        const result = await strapiFormationsInitialesHttpClient.getAll();

        // Then
        expect(result).to.deep.equal(formationsInitialesHttp);
      });
    });
  });

  context("Lorsque je supprime une formation initiale", () => {
    it("je fais un appel HTTP avec la bonne URL", async () => {
      // When
      await strapiFormationsInitialesHttpClient.delete(formationInitialeASupprimer);

      // Then
      expect(spyOnDelete).to.have.been.calledOnce;
      expect(spyOnDelete.getCall(0).args).to.deep.equal([
        `/formation-initiale-details/${formationInitialeASupprimer.id}`,
      ]);
    });
  });

  context("Lorsque je sauvegarde une formation initiale", () => {
    it("je fais un appel HTTP avec la bonne URL", async () => {
      // When
      await strapiFormationsInitialesHttpClient.post(formationInitialeASauvegarder);

      // Then
      // there have been two calls to the mock, one for authentication and one for the actual request
      expect(spyOnPost).to.have.been.calledTwice;
      expect(spyOnPost.getCall(0).args).to.deep.equal([
        "/auth/local",
        {
          "identifier": username,
          "password": password,
        },
      ]);

      expect(spyOnPost.getCall(1).args).to.deep.equal([
          "/formation-initiale-details",
          { data: formationInitialeASauvegarder.recupererAttributs() },
        ],
      );
    });
  });
});
