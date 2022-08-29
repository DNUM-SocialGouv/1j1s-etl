import { Axios, AxiosError } from "axios";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { BasicFlowHttpClient } from "@extraction/infrastructure/gateway/client/basic-flow-http.client";
import { LectureFluxErreur } from "@extraction/domain/flux.repository";
import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";

let errorCode: number;
let url: string;
let axios: StubbedClass<Axios>;
let fluxHttpClient: FlowClient;

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
			const result = await fluxHttpClient.fetch(url);

			expect(result).to.eq("<p>Hello World</p>");
		});
	});

	context("Lorsque je récupère un flux qui n'existe pas", () => {
		beforeEach(() => {
			errorCode = 500;
			axios.get.rejects(new AxiosError("Some error", errorCode.toString()));
		});

		it("je lance une erreur", async () => {
			await expect(fluxHttpClient.fetch(url)).to.be.rejectedWith(
				LectureFluxErreur,
				`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`
			);
		});
	});
});
