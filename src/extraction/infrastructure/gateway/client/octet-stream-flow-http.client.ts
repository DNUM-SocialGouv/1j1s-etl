import { FlowClient } from "@extraction/infrastructure/gateway/client/flow.strategy";
import { OctetStreamHttpClient } from "@extraction/infrastructure/gateway/common/octet-stream-http.client";

export class OctetStreamFlowHttpClient implements FlowClient {
    constructor(private readonly octetStreamHttpClient: OctetStreamHttpClient) {
    }

    async fetch(url: string): Promise<string> {
        return (await this.octetStreamHttpClient.readStream(url)).toString();
    }
}
