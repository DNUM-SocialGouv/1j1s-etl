import { AxiosInstance } from "axios";

import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import {
	HousingBasicFlowHttpClient,
} from "@logements/src/extraction/infrastructure/gateway/client/housing-basic-flow-http.client";

import { Logger } from "@shared/src/infrastructure/configuration/logger";

let url: string;
let axios: StubbedType<AxiosInstance>;
let logger: StubbedType<Logger>;
let housingBasicFlowHttpClient: HousingBasicFlowHttpClient;

describe("HousingBasicFlowHttpClientTest", () => {
	beforeEach(() => {
		logger = stubInterface<Logger>(sinon);
		axios = stubInterface<AxiosInstance>(sinon);
		url = "http://some.url";
		housingBasicFlowHttpClient = new HousingBasicFlowHttpClient(axios as unknown as AxiosInstance);
	});

	context("Lorsque je récupère un flux existant", () => {
		beforeEach(() => {
			axios.get.resolves({ data: { titre: "Hello World" } });
		});

		it("je le retourne au format textuel", async () => {
			const result = await housingBasicFlowHttpClient.pull(url, logger);

			expect(result).to.eq("{\"titre\":\"Hello World\"}");
		});
	});
});
