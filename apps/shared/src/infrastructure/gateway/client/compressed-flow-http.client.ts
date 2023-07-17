import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { FlowClient } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { UnzipClient } from "@shared/src/infrastructure/gateway/unzip.client";

export class CompressedFlowHttpClient implements FlowClient {
	constructor(
		private readonly octetStreamHttpClient: OctetStreamHttpClient,
		private readonly unzipClient: UnzipClient,
	) {
	}

	public async pull(url: string, logger: Logger): Promise<string> {
		try {
			logger.info(`Starting to pull flow from url ${url}`);
			const fileContent = await this.octetStreamHttpClient.readStream(url);
			console.log("fileContent", fileContent);
			const unzippedFileContent = await this.unzipClient.unzipGzip(fileContent);
			console.log("unzippedFileContent", unzippedFileContent);
			return unzippedFileContent.toString();
		} catch (e) {
			throw new LectureFluxErreur(url);
		} finally {
			logger.info(`End of pulling flow from url ${url}`);
		}
	}
}
