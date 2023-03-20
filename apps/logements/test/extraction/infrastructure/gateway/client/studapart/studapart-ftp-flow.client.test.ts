import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { Configuration } from "@logements/src/extraction/infrastructure/configuration/configuration";
import {
	StudapartFtpFlowClient,
} from "@logements/src/extraction/infrastructure/gateway/client/studapart/studapart-ftp-flow.client";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { FtpClient } from "@shared/src/infrastructure/gateway/client/ftp.client";
import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";

describe("StudapartFtpFlowClientTest", () => {
    const url = "ftp://url";

    let configuration: StubbedType<Configuration>;
    let ftpClient: StubbedClass<FtpClient>;
    let streamZipClient: StubbedClass<StreamZipClient>;
    let fileSystemClient: StubbedType<FileSystemClient>;
    let logger: StubbedType<Logger>;

    let studapartFtpFlowClient: StudapartFtpFlowClient;

    beforeEach(() => {
        configuration = stubInterface<Configuration>(sinon);
        configuration.STUDAPART.NAME = "studapart";
        configuration.STUDAPART.RAW_FILE_EXTENSION = ".xml";
        configuration.STUDAPART.URL = "ftp://url";
        configuration.STUDAPART.USERNAME = "username";
        configuration.STUDAPART.PASSWORD = "password";

        ftpClient = stubClass(FtpClient);
        streamZipClient = stubClass(StreamZipClient);
        fileSystemClient = stubInterface<FileSystemClient>(sinon);
        fileSystemClient.read.resolves("<xml>super</xml>");
        logger = stubInterface<Logger>(sinon);

        studapartFtpFlowClient = new StudapartFtpFlowClient(configuration, ftpClient, streamZipClient, fileSystemClient);
    });

    context("Lorsque je veux tirer le flux Studapart depuis le serveur FTP distant", () => {
        it("j'appelle le serveur ftp avec les bonnes valeurs", async () => {
            await studapartFtpFlowClient.pull(url, logger);

            expect(ftpClient.connect).to.have.been.calledWith(url, "username", "password", true);
        });
    });

    context("Lorsque je suis connecté et que je veux télécharger le fichier depuis le serveur distant", () => {
        it("j'appelle le serveur FTP avec le chemin du fichier à copier/coller", async () => {
            await studapartFtpFlowClient.pull(url, logger);

            expect(ftpClient.downloadFileAndCopy).to.have.been.calledWith("tpm-unjeuneunesolution.zip", "unjeuneunesolution.zip");
        });
    });

    context("Après avoir récupéré le fichier depuis le serveur FTP", () => {
        it("je décompresse le fichier", async () => {
            await studapartFtpFlowClient.pull(url, logger);

            expect(streamZipClient.extract).to.have.been.calledWith("tpm-unjeuneunesolution.zip", "unjeuneunesolution.xml", "tpm-extract-unjeuneunesolution.xml");
        });

        it("et je retourne le contenu du flux sous forme de chaîne de caractères", async () => {
            await studapartFtpFlowClient.pull(url, logger);

            expect(fileSystemClient.read).to.have.been.calledWith("tpm-extract-unjeuneunesolution.xml");
        });

        it("et enfin je supprime les fichiers temporaires", async () => {
            await studapartFtpFlowClient.pull(url, logger);

            expect(fileSystemClient.delete).to.have.been.calledWith("tpm-unjeuneunesolution.zip");
            expect(fileSystemClient.delete).to.have.been.calledWith("tpm-extract-unjeuneunesolution.xml");
            expect(ftpClient.closeConnection).to.have.been.calledWith();
        });
    });

    context("Quand il y a quelque chose qui ne se passe pas bien", () => {
        beforeEach(() => {
            ftpClient.connect.rejects();
        });

        it("je lance une error", async () => {
            await expect(studapartFtpFlowClient.pull(url, logger)).to.be.rejectedWith(
                Error,
            );
        });
    });
});
