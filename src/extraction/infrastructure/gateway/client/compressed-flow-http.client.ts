import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@extraction/infrastructure/gateway/common/unzip.client";
import { LectureFluxErreur } from "@extraction/domain/flux.repository";
import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";

export class CompressedFlowHttpClient implements FlowClient {
	constructor(
		private readonly octetStreamHttpClient: OctetStreamHttpClient,
		private readonly unzipClient: UnzipClient
	) {
	}

	async fetch(url: string): Promise<string> {
		const fileContent = await this.octetStreamHttpClient.readStream(url);

		try {
			return (await this.unzipClient.unzipGzip(fileContent)).toString();
		} catch (e) {
			throw new LectureFluxErreur(url);
		}
	}
}
