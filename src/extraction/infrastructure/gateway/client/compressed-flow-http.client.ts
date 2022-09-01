import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@extraction/domain/flux.repository";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@extraction/infrastructure/gateway/common/unzip.client";

export class CompressedFlowHttpClient implements FlowClient {
	constructor(
		private readonly octetStreamHttpClient: OctetStreamHttpClient,
		private readonly unzipClient: UnzipClient
	) {
	}

	public async pull(url: string): Promise<string> {
		const fileContent = await this.octetStreamHttpClient.readStream(url);

		try {
			return (await this.unzipClient.unzipGzip(fileContent)).toString();
		} catch (e) {
			throw new LectureFluxErreur(url);
		}
	}
}
