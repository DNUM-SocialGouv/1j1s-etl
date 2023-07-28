import { Client } from "minio";

import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { UnJeuneUneSolution } from "@formations-initiales/src/transformation/domain/model/1jeune1solution";
import { FluxTransformation } from "@formations-initiales/src/transformation/domain/model/flux";
import { Configuration } from "@formations-initiales/src/transformation/infrastructure/configuration/configuration";
import {
  MinioFormationsInitialesRepository,
} from "@formations-initiales/src/transformation/infrastructure/gateway/repository/minio-formations-initiales.repository";

import { DateService } from "@shared/src/domain/service/date.service";
import { Logger, LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { ContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { EcritureFluxErreur, RecupererContenuErreur } from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

let localFileNameIncludingPath: string;
let formationsInitiales: Array<UnJeuneUneSolution.FormationInitiale>;
let fileContent: string;
let latestFileNameIncludingPath: string;
let historyFileNameIncludingPath: string;

let configuration: StubbedType<Configuration>;
let fileSystemClient: StubbedType<FileSystemClient>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let flux: FluxTransformation;
let uuidClient: StubbedType<UuidGenerator>;
let minioStub: StubbedClass<Client>;
let dateService: StubbedClass<DateService>;
let minioFormationsInitialesRepository: MinioFormationsInitialesRepository;
let contentParser: StubbedType<ContentParser>;

describe("MinioFormationsInitialesRepositoryTest", () => {
  beforeEach(() => {
    latestFileNameIncludingPath = "source/latest.json";
    historyFileNameIncludingPath = "source/history/2022-01-01T00:00:00.000Z.json";

    fileContent = "<xml></xml>";
    flux = new FluxTransformation("source", "history", ".xml", ".json");

    formationsInitiales = [
      {
        identifiant: "identifiant",
        intitule: "libelle_complet",
        duree: "duree_formation",
        certification: "niveau_certification",
        niveauEtudesVise: "niveau_etudes",
        description: "descriptif_format_court",
        attendusParcoursup: "attendus",
        conditionsAcces: "descriptif_acces",
        poursuiteEtudes: "descriptif_poursuite_etudes",
      },
    ];

    localFileNameIncludingPath = "./tmp/d184b5b1-75ad-44f0-8fe7-7c55208bf26c";

    minioStub = stubClass<Client>(Client);

    loggerStrategy = stubInterface<LoggerStrategy>(sinon);
    logger = stubInterface<Logger>(sinon);
    loggerStrategy.get.returns(logger);

    configuration = stubInterface<Configuration>(sinon);
    configuration.MINIO.RAW_BUCKET_NAME = "raw";
    configuration.MINIO.TRANSFORMED_BUCKET_NAME = "json";
    configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";

    fileSystemClient = stubInterface<FileSystemClient>(sinon);
    uuidClient = stubInterface<UuidGenerator>(sinon);
    dateService = stubClass(DateService);
    dateService.maintenant.returns(new Date("2022-01-01T00:00:00.000Z"));
    contentParser = stubInterface<ContentParser>(sinon);

    uuidClient.generate.returns("d184b5b1-75ad-44f0-8fe7-7c55208bf26c");
    minioFormationsInitialesRepository = new MinioFormationsInitialesRepository(
      configuration,
      minioStub,
      fileSystemClient,
      uuidClient,
      dateService,
      loggerStrategy,
      contentParser,
    );
  });

  describe("recuperer", () => {
    context("Lorsque je récupère le contenu d'un fichier", () => {
      beforeEach(() => {
        configuration = stubInterface<Configuration>(sinon);
        configuration.MINIO.RAW_BUCKET_NAME = "raw";

        uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
        localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

        minioStub.fGetObject.resolves();
        fileSystemClient.read.resolves(fileContent);
        contentParser.parse.resolves(formationsInitiales);
      });

      it("je récupère le contenu du fichier", async () => {
        const result = await minioFormationsInitialesRepository.recuperer(
          flux,
        );

        expect(result).to.eql(formationsInitiales);
        expect(uuidClient.generate).to.have.been.calledOnce;
        expect(minioStub.fGetObject).to.have.been.calledOnce;
        expect(minioStub.fGetObject).to.have.been.calledWith(
          configuration.MINIO.RAW_BUCKET_NAME,
          "source/latest.xml",
          localFileNameIncludingPath
        );
        expect(fileSystemClient.read).to.have.been.calledOnce;
        expect(fileSystemClient.read).to.have.been.calledWith(localFileNameIncludingPath);
        expect(fileSystemClient.delete).to.have.been.calledOnce;
        expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath); });
    });

    context("Lorsque je ne réussis pas à lire le contenu d'un fichier", () => {
      beforeEach(() => {
        configuration = stubInterface<Configuration>(sinon);
        configuration.MINIO.RAW_BUCKET_NAME = "raw";

        uuidClient.generate.returns("f278702a-ea1f-445b-a58a-37ee58892175");
        localFileNameIncludingPath = "./tmp/f278702a-ea1f-445b-a58a-37ee58892175";

        minioStub.fGetObject.rejects(new Error("Oops! Something went wrong !"));
      });

      it("je lance une erreur", async () => {
        await expect(minioFormationsInitialesRepository.recuperer(
          new FluxTransformation("source", "history", ".xml", ".json"),
        )).to.be.rejectedWith(
          RecupererContenuErreur,
          "Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu",
        );
      });
    });
  });

  describe("sauvegarder", () => {
    context("Lorsque j'écris le contenu d'un fichier qui existe bien et qu'il est bien nommé dans un dossier racine existant", () => {
      it("j'écris le contenu du fichier", async () => {
        await minioFormationsInitialesRepository.sauvegarder(formationsInitiales, flux);

        expect(uuidClient.generate).to.have.been.calledOnce;

        expect(fileSystemClient.write).to.have.been.calledOnce;
        expect(fileSystemClient.write.getCall(0).args[0]).to.eql(localFileNameIncludingPath);
        expect(JSON.parse(fileSystemClient.write.getCall(0).args[1] as string)).to.have.deep.members(formationsInitiales);

        expect(minioStub.fPutObject).to.have.been.calledTwice;
        expect(minioStub.fPutObject.firstCall.args).to.have.deep.members([
          configuration.MINIO.TRANSFORMED_BUCKET_NAME,
          historyFileNameIncludingPath,
          localFileNameIncludingPath,
        ]);
        expect(minioStub.fPutObject.secondCall.args).to.have.deep.members([
          configuration.MINIO.TRANSFORMED_BUCKET_NAME,
          latestFileNameIncludingPath,
          localFileNameIncludingPath,
        ]);

        expect(fileSystemClient.delete).to.have.been.calledOnce;
        expect(fileSystemClient.delete).to.have.been.calledWith(localFileNameIncludingPath);
      });
    });

    context("Lorsque je n'arrive pas à écrire le fichier chez moi", () => {
      beforeEach(() => {
        fileSystemClient.write.rejects(new Error("Oops! Something went wrong !"));
      });

      it("je lance une erreur", async () => {
        await expect(minioFormationsInitialesRepository.sauvegarder(formationsInitiales, flux)).to.be.rejectedWith(
          EcritureFluxErreur,
          "Le flux source n'a pas été extrait car une erreur d'écriture est survenue",
        );
      });
    });
  });
});
