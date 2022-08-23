import { FluxClient, LectureFluxErreur } from "@extraction/domain/flux.client";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";
import { UnzipClient } from "@extraction/infrastructure/gateway/common/unzip.client";

export class CompressedFlowHttpClient implements FluxClient {
	constructor(
		private readonly octetStreamHttpClient: OctetStreamHttpClient,
		private readonly unzipClient: UnzipClient
	) {
	}

	async recuperer(url: string): Promise<string> {
		const fileContent = await this.octetStreamHttpClient.readStream(url);

		try {
			return (await this.unzipClient.unzipGzip(fileContent)).toString();
		} catch (e) {
			throw new LectureFluxErreur(url);
		}
	}
}
