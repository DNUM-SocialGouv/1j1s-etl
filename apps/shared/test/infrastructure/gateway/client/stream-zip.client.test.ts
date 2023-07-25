import StreamZip, { ZipEntry } from "node-stream-zip";

import { expect, sinon } from "@test/library";

import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";

describe("StreamZipClient", () => {
  let mockZip: sinon.SinonStubbedInstance<StreamZip.StreamZipAsync>;

  beforeEach(() => {
    mockZip = sinon.createStubInstance(StreamZip.async);
    sinon.stub(StreamZip, "async").returns(mockZip);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("extract", () => {
    it("Extrait le fichier en appellant la methode extract de StreamZip", async () => {
      const filePath = "filePath";
      const fileNameInZip = "fileNameInZip";
      const outPath = "outPath";
      mockZip.extract.resolves();

      const streamZipClient = new StreamZipClient();
      await streamZipClient.extract(filePath, fileNameInZip, outPath);
      
      expect(mockZip.extract).to.have.been.calledWith(fileNameInZip, outPath);
      expect(mockZip.close).to.have.been.called;
    });
  });

  describe("extractOnlyFileWithUnknowName", () => {
    describe("Lorsque le zip contient plusieurs fichiers", () => {
      it("Lance une erreur", async () => {
        const filePath = "filePath";
        const entries = {
          "file1": {} as ZipEntry,
          "file2": {} as ZipEntry,
        };
        mockZip.entries.returns(new Promise(resolve => resolve(entries)));

        const streamZipClient = new StreamZipClient();
        await expect(streamZipClient.extractOnlyFileWithUnknowName(filePath)).to.be.rejectedWith("Multiple files inside the zip");

        expect(mockZip.entryData).to.not.have.been.called;
      });
    });

    describe("Lorsque le zip contient un seul fichier", () => {
      it("Extrait le fichier en appellant la methode entryData de StreamZip", async () => {
        const filePath = "filePath";
        const entries = {
          "file1": {} as ZipEntry,
        };
        const fileContent = "fileContent" as unknown as Buffer;
        mockZip.entries.returns(new Promise(resolve => resolve(entries)));
        mockZip.entryData.returns(new Promise(resolve => resolve(fileContent)));

        const streamZipClient = new StreamZipClient();
        const result = await streamZipClient.extractOnlyFileWithUnknowName(filePath);

        expect(mockZip.entryData).to.have.been.calledWith(entries["file1"]);
        expect(result).to.equal(fileContent);
      });
    });
  });
});
