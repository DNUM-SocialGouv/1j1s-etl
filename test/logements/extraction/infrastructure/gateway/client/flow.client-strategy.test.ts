import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { FlowClient, FluxNonGereErreur } from "@shared/infrastructure/gateway/client/flow.strategy";
import { Logger } from "@shared/configuration/logger";
import { Configuration } from "@logements/extraction/configuration/configuration";
import { HousingsOnFlowNameStrategy } from "@logements/extraction/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@logements/extraction/domain/flux";
import { expect } from "@test/configuration";

const url = "http://some.url";

let flow: FluxExtraction;

let housingsBasicFlowClient: StubbedType<FlowClient>;
let logger: StubbedType<Logger>;


let flowStrategy: HousingsOnFlowNameStrategy;
describe("HousingsOnFlowNameStrategyTest", () => {
	beforeEach(() => {
		const configuration = stubInterface<Configuration>(sinon);
		configuration.IMMOJEUNE.NAME = "immojeune";

		housingsBasicFlowClient = stubInterface<FlowClient>(sinon);
		logger = stubInterface<Logger>(sinon);

		flowStrategy = new HousingsOnFlowNameStrategy(
			configuration,
			housingsBasicFlowClient,
		);
	});

	context("Lorsque je récupère le contenu du flux Immojeune", () => {
		beforeEach(() => {
			flow = new FluxExtraction("immojeune", ".json", "history", "http://some.url");
		});

		it("utilise le bon client pour Immojeune", async () => {
			await flowStrategy.get(flow, logger);

			expect(housingsBasicFlowClient.pull).to.have.been.calledOnce;
			expect(housingsBasicFlowClient.pull).to.have.been.calledWith(url);
		});
	});

	context("Lorsque j'essaie de récupérer le contenu d'un flux dont le nom n'est pas présent", () => {
		beforeEach(() => {
			flow = new FluxExtraction("unknown-flow", ".json", "history", "http://some.url");
		});

		it("lance une erreur", async () => {
			await expect(flowStrategy.get(flow, logger)).to.be.rejectedWith(
				FluxNonGereErreur,
				`Le flux ${flow.nom} n'est pas actuellement géré`,
			);

			expect(housingsBasicFlowClient.pull).to.not.have.been.called;
		});
	});
});
