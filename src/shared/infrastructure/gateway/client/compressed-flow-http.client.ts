import { FlowClient } from "@shared/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { Logger } from "@shared/configuration/logger";
import { OctetStreamHttpClient } from "@shared/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@shared/infrastructure/gateway/common/unzip.client";

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
			return (await this.unzipClient.unzipGzip(fileContent)).toString();
		} catch (e) {
			throw new LectureFluxErreur(url);
		} finally {
			logger.info(`End of pulling flow from url ${url}`);
		}
	}
}
