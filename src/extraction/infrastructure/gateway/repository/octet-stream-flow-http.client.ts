import { FluxClient } from "@extraction/domain/flux.client";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";

export class OctetStreamFlowHttpClient implements FluxClient {
    constructor(private readonly octetStreamHttpClient: OctetStreamHttpClient) {
    }

    async recuperer(url: string): Promise<string> {
        return (await this.octetStreamHttpClient.readStream(url)).toString();
    }
}
