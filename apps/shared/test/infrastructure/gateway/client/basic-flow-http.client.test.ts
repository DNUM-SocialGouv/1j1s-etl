import { Axios, AxiosError } from "axios";
import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { expect, StubbedClass, stubClass } from "@test/configuration";

import { BasicFlowHttpClient } from "@shared/src/infrastructure/gateway/client/basic-flow-http.client";
import { FlowClient } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { Logger } from "@shared/src/configuration/logger";

let errorCode: number;
let url: string;
let axios: StubbedClass<Axios>;
let logger: StubbedType<Logger>;
let fluxHttpClient: FlowClient;

describe("FluxHttpClientTest", () => {
	beforeEach(() => {
		logger = stubInterface<Logger>(sinon);
		axios = stubClass(Axios);
		url = "http://some.url";
		fluxHttpClient = new BasicFlowHttpClient(axios);
	});

	context("Lorsque je récupère un flux existant", () => {
		beforeEach(() => {
			axios.get.resolves({ data: "<p>Hello World</p>" });
		});

		it("je le retourne au format textuel", async () => {
			const result = await fluxHttpClient.pull(url, logger);

			expect(result).to.eq("<p>Hello World</p>");
		});
	});

	context("Lorsque je récupère un flux qui n'existe pas", () => {
		beforeEach(() => {
			errorCode = 500;
			axios.get.rejects(new AxiosError("Some error", errorCode.toString()));
		});

		it("je lance une erreur", async () => {
			await expect(fluxHttpClient.pull(url, logger)).to.be.rejectedWith(
				LectureFluxErreur,
				`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`,
			);
		});
	});
});
