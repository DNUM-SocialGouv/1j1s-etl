import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@extraction/domain/flux.repository";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@extraction/infrastructure/gateway/common/unzip.client";
import { Logger } from "@shared/configuration/logger";

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
