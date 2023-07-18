import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import {
  OnisepFlowHttpClient,
} from "@formations-initiales/src/extraction/infrastructure/gateway/client/onisep-flow-http.client";

import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { OctetStreamHttpClient } from "@shared/src/infrastructure/gateway/common/octet-stream-http.client";

describe("OnisepFlowHttpClient", () => {
  const url = "http://url";

  let httpClient: StubbedClass<OctetStreamHttpClient>;
  let streamZipClient: StubbedClass<StreamZipClient>;
  let fileSystemClient: StubbedType<FileSystemClient>;
  let logger: StubbedType<Logger>;

  let onisepFlowHttpClient: OnisepFlowHttpClient;
  const TMP_FILE_ZIP_PATH = "tmp-unjeuneunesolution-onisep.zip";

  beforeEach(() => {
    httpClient = stubClass(OctetStreamHttpClient);
    httpClient.readStream.resolves(Buffer.from("<xml>trop cool</xml>"));
    streamZipClient = stubInterface(sinon);
    streamZipClient.extractOnlyFileWithUnknowName.resolves("<xml>trop cool</xml>");
    fileSystemClient = stubInterface(sinon);
    fileSystemClient.read.resolves("<xml>trop cool</xml>");
    logger = stubInterface(sinon);

    onisepFlowHttpClient = new OnisepFlowHttpClient(
      httpClient,
      streamZipClient,
      fileSystemClient,
    );
  });

  context("Lorsque je veux tirer le flux Onisep depuis le serveur HTTP distant", () => {
    it("j'appelle le serveur HTTP avec les bonnes valeurs", async () => {
      await onisepFlowHttpClient.pull(url, logger);

      expect(httpClient.readStream).to.have.been.calledWith(url);
    });
    it("écrit le contenu du fichier dans un fichier temporaire", async () => {
      await onisepFlowHttpClient.pull(url, logger);

      expect(fileSystemClient.write).to.have.been.calledWith(TMP_FILE_ZIP_PATH, Buffer.from("<xml>trop cool</xml>"));
    });
    it("extrait le contenu du fichier depuis le fichier temporaire", async () => {
      await onisepFlowHttpClient.pull(url, logger);

      expect(streamZipClient.extractOnlyFileWithUnknowName).to.have.been.calledWith(TMP_FILE_ZIP_PATH);
    });
    it("retourne le contenu du fichier extrait", async () => {
      const result = await onisepFlowHttpClient.pull(url, logger);

      expect(result).to.be.equal("<xml>trop cool</xml>");
    });
  });
  context("Lorsqu’une erreur survient pendant la recuperation du flux", () => {
    it("je lève une erreur", async () => {
      httpClient.readStream.rejects(new Error("Erreur de lecture"));

      await expect(onisepFlowHttpClient.pull(url, logger)).to.be.rejectedWith(`Le flux à l'adresse ${url} n'a pas été extrait car une erreur de lecture est survenue`);
    });
  });
});
