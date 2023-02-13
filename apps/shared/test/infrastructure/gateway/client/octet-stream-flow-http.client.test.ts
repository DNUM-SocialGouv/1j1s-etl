import sinon from "sinon";

import { expect, StubbedClass, stubClass } from "@test/configuration";
import { LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { Logger } from "@shared/src/configuration/logger";
import { OctetStreamFlowHttpClient } from "@shared/src/infrastructure/gateway/client/octet-stream-flow-http.client";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";

let url: string;
let contenu: Buffer;

let logger: StubbedType<Logger>;
let octetStreamHttpClient: StubbedClass<OctetStreamHttpClient>;
let octetstramFlowHttpClient: OctetStreamFlowHttpClient;

describe("OctetStramFlowHttpTest", () => {
	beforeEach(() => {
		octetStreamHttpClient = stubClass(OctetStreamHttpClient);
		logger = stubInterface<Logger>(sinon);
		octetstramFlowHttpClient = new OctetStreamFlowHttpClient(octetStreamHttpClient);
		url = "http://some.url";
	});

	context("Lorsque je récupère un flux de données", () => {
		beforeEach(() => {
			contenu = Buffer.from("<html>test</html>");
			octetStreamHttpClient.readStream.resolves(contenu);
		});

		it("j'écris les données dans un fichier jusqu'à la fin du téléchargement", async () => {
			const result = await octetstramFlowHttpClient.pull(url, logger);

			expect(result).to.eql("<html>test</html>");

			expect(octetStreamHttpClient.readStream).to.have.been.called;
			expect(octetStreamHttpClient.readStream).to.have.been.calledWith(url);
		});
	});

	context("Lorsque je souhaite recupérer un flux de données et qu'il y a une erreur", () => {
		beforeEach(() => {
			octetStreamHttpClient.readStream.withArgs(url).rejects(new LectureFluxErreur(url));
		});

		it("je renvoie une erreur", async () => {
			await expect(octetstramFlowHttpClient.pull(url, logger)).to.be.rejectedWith(
				LectureFluxErreur,
				`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`,
			);
		});
	});
});
