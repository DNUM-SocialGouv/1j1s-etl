import { Logger } from "@shared/configuration/logger";
import { Configuration } from "@logements/extraction/configuration/configuration";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { StreamZipClient } from "@logements/extraction/infrastructure/gateway/client/studapart/stream-zip.client";
import { FlowClient } from "@shared/infrastructure/gateway/client/flow.strategy";
import { FtpClient } from "@logements/extraction/infrastructure/gateway/client/studapart/ftp.client";

export class StudapartFtpFlowClient implements FlowClient {

    TMP_FILE_ZIP_PATH = "tpm-unjeuneunesolution.zip";
    TMP_EXTRACT_XML = "tpm-extract-unjeuneunesolution.xml";
    FILE_PATH_FROM_REMOTE = "unjeuneunesolution.zip";
    FILE_NAME_IN_ZIP = "unjeuneunesolution.xml";

    constructor(
        private readonly configuration: Configuration,
        private readonly ftpClient: FtpClient,
        private readonly streamZipClient: StreamZipClient,
        private readonly fileSystemClient: FileSystemClient
    ) {
    }

    async pull(url: string, logger: Logger): Promise<string> {

        try {
            logger.info("Start of ftp connection");
            await this.ftpClient.connect(
                this.configuration.STUDAPART.URL,
                this.configuration.STUDAPART.USERNAME,
                this.configuration.STUDAPART.PASSWORD,
                true,
            );

            await this.ftpClient.downloadFileAndCopy(this.TMP_FILE_ZIP_PATH, this.FILE_PATH_FROM_REMOTE);
            logger.info("Successful retrieve of zip file");

            await this.streamZipClient.extract(this.TMP_FILE_ZIP_PATH, this.FILE_NAME_IN_ZIP, this.TMP_EXTRACT_XML);
            logger.info("Successful extracting zip file content");

            const rawFile = await this.fileSystemClient.read(this.TMP_EXTRACT_XML);
            logger.info("Successful reading xml file");

            return rawFile.toString();
        }
        catch(err) {
            logger.error(err);
            throw err;
        } finally {
            await this.fileSystemClient.delete(this.TMP_FILE_ZIP_PATH);
            await this.fileSystemClient.delete(this.TMP_EXTRACT_XML);
            this.ftpClient.closeConnection();
            logger.info("End of ftp connection");
        }
    }
}
