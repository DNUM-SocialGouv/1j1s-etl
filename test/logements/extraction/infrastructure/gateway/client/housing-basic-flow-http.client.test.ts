import { expect, StubbedClass, stubClass } from "@test/configuration";
import { Axios } from "axios";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { Logger } from "@shared/configuration/logger";
import { HousingBasicflowClient } from "@logements/extraction/infrastructure/gateway/client/housing-basicflow.client";
import sinon from "sinon";

let url: string;
let axios: StubbedClass<Axios>;
let logger: StubbedType<Logger>;
let housingBasicFlowClient: HousingBasicflowClient;

describe("HousingBasicflowClientTest", () => {
	beforeEach(() => {
		logger = stubInterface<Logger>(sinon);
		axios = stubClass(Axios);
		url = "http://some.url";
		housingBasicFlowClient = new HousingBasicflowClient(axios);
	});

	context("Lorsque je récupère un flux existant", () => {
		beforeEach(() => {
			axios.get.resolves({ data: { titre: "Hello World" } });
		});

		it("je le retourne au format textuel", async () => {
			const result = await housingBasicFlowClient.pull(url, logger);

			expect(result).to.eq("{\"titre\":\"Hello World\"}");
		});
	});
});
