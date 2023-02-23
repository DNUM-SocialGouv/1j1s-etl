import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { Axios } from "axios";
import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";

import {
	HousingBasicFlowHttpClient,
} from "@logements/src/extraction/infrastructure/gateway/client/housing-basic-flow-http.client";

import { Logger } from "@shared/src/configuration/logger";

let url: string;
let axios: StubbedClass<Axios>;
let logger: StubbedType<Logger>;
let housingBasicFlowHttpClient: HousingBasicFlowHttpClient;

describe("HousingBasicFlowHttpClientTest", () => {
	beforeEach(() => {
		logger = stubInterface<Logger>(sinon);
		axios = stubClass(Axios);
		url = "http://some.url";
		housingBasicFlowHttpClient = new HousingBasicFlowHttpClient(axios);
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
