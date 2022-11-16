import { FlowClient } from "@shared/infrastructure/gateway/client/flow.strategy";
import { LectureFluxErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { Logger } from "@shared/configuration/logger";
import { OctetStreamHttpClient } from "@shared/infrastructure/gateway/common/octet-stream-http.client";

export class OctetStreamFlowHttpClient implements FlowClient {
    constructor(private readonly octetStreamHttpClient: OctetStreamHttpClient) {
    }

    public async pull(url: string, logger: Logger): Promise<string> {
        try {
            logger.info(`Starting to pull flow from url ${url}`);
            return (await this.octetStreamHttpClient.readStream(url)).toString();
        } catch (e) {
            throw new LectureFluxErreur(url);
        } finally {
            logger.info(`End of pulling flow from url ${url}`);
        }
    }
}
