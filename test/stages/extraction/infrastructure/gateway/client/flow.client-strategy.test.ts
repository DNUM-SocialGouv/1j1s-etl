import sinon from "sinon";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

import { Configuration } from "@stages/extraction/configuration/configuration";
import { expect } from "@test/configuration";
import { FlowClient, FluxNonGereErreur } from "@shared/infrastructure/gateway/client/flow.strategy";
import { FluxExtraction } from "@stages/extraction/domain/flux";
import { Logger } from "@shared/configuration/logger";
import { StagesOnFlowNameStrategy } from "@stages/extraction/infrastructure/gateway/client/flow.strategy";

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
		configuration.HELLO_WORK.NAME = "hello-work";
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

	context("Lorsque je récupère le contenu du flux Hello work", () => {
		beforeEach(() => {
			flow = {
				nom: "hello-work",
				extension: ".xml",
				dossierHistorisation: "history",
				url: "http://some.url",
			};
		});

		it("utilse le bon client pour Hello work", async () => {
			await flowStrategy.get(flow, logger);

			expect(compressedFlowClient.pull).to.have.been.calledOnce;
			expect(compressedFlowClient.pull).to.have.been.calledWith(url);
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
