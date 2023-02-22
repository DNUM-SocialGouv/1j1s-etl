import { expect, sinon, StubbedType, stubInterface } from "@test/configuration";

import { Configuration } from "@logements/src/extraction/configuration/configuration";
import { FlowClient, FluxNonGereErreur } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { Logger } from "@shared/src/configuration/logger";
import { HousingsOnFlowNameStrategy } from "@logements/src/extraction/infrastructure/gateway/client/housing-on-flow-name.strategy";
import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";

const url = "http://some.url";

let flow: FluxExtraction;
let housingsBasicFlowClient: StubbedType<FlowClient>;
let studapartFlowClient: StubbedType<FlowClient>;
let logger: StubbedType<Logger>;
let flowStrategy: HousingsOnFlowNameStrategy;

describe("HousingsOnFlowNameStrategyTest", () => {
	beforeEach(() => {
		const configuration = stubInterface<Configuration>(sinon);
		configuration.IMMOJEUNE.NAME = "immojeune";
		configuration.STUDAPART.NAME = "studapart";

		housingsBasicFlowClient = stubInterface<FlowClient>(sinon);
		studapartFlowClient = stubInterface<FlowClient>(sinon);
		logger = stubInterface<Logger>(sinon);

		flowStrategy = new HousingsOnFlowNameStrategy(
			configuration,
			housingsBasicFlowClient,
			studapartFlowClient,
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

	context("Lorsque je récupère le contenu du flux studapart", () => {
		beforeEach(() => {
			flow = new FluxExtraction("studapart", ".xml", "history", "ftp://some.url");
		});

		it("utilise le bon client pour studapart", async () => {
			await flowStrategy.get(flow, logger);

			expect(studapartFlowClient.pull).to.have.been.calledOnce;
			expect(studapartFlowClient.pull).to.have.been.calledWith("ftp://some.url");
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
