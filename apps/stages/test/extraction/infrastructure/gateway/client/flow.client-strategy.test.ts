import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { FlowClient, FluxNonGereErreur } from "@shared/src/infrastructure/gateway/client/flow.strategy";

import { Configuration } from "@stages/src/extraction/configuration/configuration";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { StagesOnFlowNameStrategy } from "@stages/src/extraction/infrastructure/gateway/client/flow.strategy";

const url = "http://some.url";

let flow: FluxExtraction;
let basicFlowClient: StubbedType<FlowClient>;
let compressedFlowClient: StubbedType<FlowClient>;
let octetStreamFlowClient: StubbedType<FlowClient>;
let logger: StubbedType<Logger>;

let flowStrategy: StagesOnFlowNameStrategy;

describe("StagesOnFlowNameStrategyTest", () => {
	beforeEach(() => {
		const configuration = stubInterface<Configuration>(sinon);
		configuration.JOBTEASER.NAME = "jobteaser";
		configuration.STAGEFR_COMPRESSED.NAME = "stagefr-compresse";
		configuration.STAGEFR_UNCOMPRESSED.NAME = "stagefr-decompresse";

		basicFlowClient = stubInterface<FlowClient>(sinon);
		compressedFlowClient = stubInterface<FlowClient>(sinon);
		octetStreamFlowClient = stubInterface<FlowClient>(sinon);
		logger = stubInterface<Logger>(sinon);

		flowStrategy = new StagesOnFlowNameStrategy(
			configuration,
			basicFlowClient,
			compressedFlowClient,
			octetStreamFlowClient,
		);
	});

	context("Lorsque je récupère le contenu du flux Jobteaser", () => {
		beforeEach(() => {
			flow = new FluxExtraction("jobteaser", ".xml", "history", "http://some.url");
		});

		it("utilise le bon client pour Jobteaser", async () => {
			await flowStrategy.get(flow, logger);

			expect(basicFlowClient.pull).to.have.been.calledOnce;
			expect(basicFlowClient.pull).to.have.been.calledWith(url);
		});
	});

	context("Lorsque je récupère le contenu du flux Stage.fr compressé", () => {
		beforeEach(() => {
			flow = new FluxExtraction("stagefr-compresse", ".xml", "history", "http://some.url");
		});

		it("utilise le bon client pour Stage.fr compressé", async () => {
			await flowStrategy.get(flow, logger);

			expect(compressedFlowClient.pull).to.have.been.calledOnce;
			expect(compressedFlowClient.pull).to.have.been.calledWith(url);
		});
	});

	context("Lorsque je récupère le contenu du flux Stage.fr décompressé", () => {
		beforeEach(() => {
			flow = new FluxExtraction("stagefr-decompresse", ".xml", "history", "http://some.url");
		});

		it("utilise le bon client pour Stage.fr décompressé", async () => {
			await flowStrategy.get(flow, logger);

			expect(octetStreamFlowClient.pull).to.have.been.calledOnce;
			expect(octetStreamFlowClient.pull).to.have.been.calledWith(url);
		});
	});

	context("Lorsque j'essaie de récupérer le contenu d'un flux dont le nom n'est pas présent", () => {
		beforeEach(() => {
			flow = new FluxExtraction("unknown-flow", ".xml", "history", "http://some.url");
		});

		it("lance une erreur", async () => {
			await expect(flowStrategy.get(flow, logger)).to.be.rejectedWith(
				FluxNonGereErreur,
				`Le flux ${flow.nom} n'est pas actuellement géré`,
			);

			expect(basicFlowClient.pull).to.not.have.been.called;
			expect(compressedFlowClient.pull).to.not.have.been.called;
			expect(octetStreamFlowClient.pull).to.not.have.been.called;
		});
	});
});
