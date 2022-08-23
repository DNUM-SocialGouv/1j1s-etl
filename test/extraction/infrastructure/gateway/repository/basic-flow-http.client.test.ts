import { Axios, AxiosError } from "axios";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { FluxClient, LectureFluxErreur } from "@extraction/domain/flux.client";
import { BasicFlowHttpClient } from "@extraction/infrastructure/gateway/repository/basic-flow-http.client";

let errorCode: number;
let url: string;
let axios: StubbedClass<Axios>;
let fluxHttpClient: FluxClient;

describe("FluxHttpClientTest", () => {
	beforeEach(() => {
		axios = stubClass(Axios);
		url = "http://some.url";
		fluxHttpClient = new BasicFlowHttpClient(axios);
	});

	context("Lorsque je récupère un flux existant", () => {
		beforeEach(() => {
			axios.get.resolves({ data: "<p>Hello World</p>" });
		});

		it("je le retourne au format textuel", async () => {
			const result = await fluxHttpClient.recuperer(url);

			expect(result).to.eq("<p>Hello World</p>");
		});
	});

	context("Lorsque je récupère un flux qui n'existe pas", () => {
		beforeEach(() => {
			errorCode = 500;
			axios.get.rejects(new AxiosError("Some error", errorCode.toString()));
		});

		it("je lance une erreur", async () => {
			await expect(fluxHttpClient.recuperer(url)).to.be.rejectedWith(
				LectureFluxErreur,
				`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`
			);
		});
	});
});
