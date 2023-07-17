import { Client } from "minio";

import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { FluxExtraction } from "@formations-initiales/src/extraction/domain/model/flux";
import { Configuration } from "@formations-initiales/src/extraction/infrastructure/configuration/configuration";
import {
  MinioHttpFlowRepository,
} from "@formations-initiales/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

import { Logger, LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FlowClient } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { EcritureFluxErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

const localFileNameIncludingPath = "/tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";
let flow: FluxExtraction;

let fileContent: string;
let fileNameIncludingPath: string;
let configuration: StubbedType<Configuration>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let flowClient: StubbedType<FlowClient>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let flowRepository: MinioHttpFlowRepository;

describe("MinioHttpFlowRepositoryTestFormation", () => {
  beforeEach(() => {
    fileNameIncludingPath = "./history/source/2022-01-01T00:00:00Z_source.xml";
    fileContent = "<toto>contenu du fichier</toto>\n";

    flow = new FluxExtraction(
      "flux_formations_initiales_onisep",
      ".xml.zip",
      "history",
      "http://some.url",
    );
    fileNameIncludingPath = fileNameIncludingPath.concat(".zip");

    minioStub = stubClass(Client);

    configuration = stubInterface<Configuration>(sinon);
    configuration.MINIO.RAW_BUCKET_NAME = "raw";
    configuration.TEMPORARY_DIRECTORY_PATH = "/tmp/";
    configuration.ONISEP.FLUX_URL = "http://flux";

    fileSystemClient = stubInterface<FileSystemClient>(sinon);

    uuidClient = stubInterface<UuidGenerator>(sinon);
    uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");

    flowClient = stubInterface<FlowClient>(sinon);
    flowClient.pull.resolves("<some>contenu</some>");

    loggerStrategy = stubInterface<LoggerStrategy>(sinon);
    logger = stubInterface<Logger>(sinon);
    loggerStrategy.get.returns(logger);

    flowRepository = new MinioHttpFlowRepository(
      configuration,
      minioStub,
      fileSystemClient,
      uuidClient,
      flowClient,
      loggerStrategy,
    );
  });

  context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
    it("j'écris le contenu d'un fichier", async () => {
      await flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow, true);

      expect(uuidClient.generate).to.have.been.calledOnce;
      expect(fileSystemClient.write).to.have.been.calledOnce;
      expect(fileSystemClient.write).to.have.been.calledWith(localFileNameIncludingPath, fileContent);
      expect(minioStub.fPutObject).to.have.been.calledOnce;
      expect(minioStub.fPutObject).to.have.been.calledWith(
        configuration.MINIO.RAW_BUCKET_NAME,
        fileNameIncludingPath.replace(".zip", ""),
        localFileNameIncludingPath,
      );
      expect(fileSystemClient.delete).to.have.been.calledOnce;
      expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
    });
  });

  context("Lorsque je n'arrive pas à écrire le fichier chez moi", () => {
    beforeEach(() => {
      fileSystemClient.write.rejects();
    });

    it("je lance une erreur", async () => {
      await expect(flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow)).to.be.rejectedWith(
        EcritureFluxErreur,
        `Le flux ${flow.nom} n'a pas été extrait car une erreur d'écriture est survenue`,
      );
    });
  });

  context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
    " fichier est invalide", () => {
    beforeEach(() => {
      minioStub.fPutObject.rejects();
    });

    it("je lance une erreur", async () => {
      await expect(flowRepository.enregistrer(fileNameIncludingPath, fileContent, flow)).to.be.rejectedWith(
        EcritureFluxErreur,
        `Le flux ${flow.nom} n'a pas été extrait car une erreur d'écriture est survenue`,
      );
      expect(fileSystemClient.delete).to.have.been.calledOnce;
      expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
    });
  });
});
