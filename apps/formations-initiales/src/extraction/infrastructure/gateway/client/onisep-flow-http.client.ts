import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { FlowClient } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";
import { LectureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";

export class OnisepFlowHttpClient implements FlowClient {
  TMP_FILE_ZIP_PATH = "tmp-unjeuneunesolution-onisep.zip";

  constructor(
    private readonly httpClient: OctetStreamHttpClient,
    private readonly streamZipClient: StreamZipClient,
    private readonly fileSystemClient: FileSystemClient
  ) {
  }

  async pull(url: string, logger: Logger): Promise<string> {
    try {
      logger.info(`Starting to pull flow from url ${url}`);
      const fileStream = await this.httpClient.readStream(url);

      logger.info(`Writing file to ${this.TMP_FILE_ZIP_PATH}`);
      await this.fileSystemClient.write(this.TMP_FILE_ZIP_PATH, fileStream);

      logger.info(`Extracting file ${this.TMP_FILE_ZIP_PATH}`);
      const extractedContent = await this.streamZipClient.extractOnlyFileWithUnknowName(this.TMP_FILE_ZIP_PATH);
      logger.info(`End of pulling flow from url ${url}`);
      return extractedContent.toString();
    } catch (e) {
      throw new LectureFluxErreur(url);
    }
  }
}
