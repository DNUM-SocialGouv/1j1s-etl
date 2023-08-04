import { Client } from "minio";

import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/library";

import { UnJeuneUneSolution } from "@formations-initiales/src/chargement/domain/model/1jeune1solution";
import { Configuration } from "@formations-initiales/src/chargement/infrastructure/configuration/configuration";
import {
  HttpClient,
  StrapiFormationsInitialesHttpClient,
} from "@formations-initiales/src/chargement/infrastructure/gateway/client/http.client";
import {
  MinioAndStrapiFormationsInitialesRepository,
} from "@formations-initiales/src/chargement/infrastructure/gateway/repository/minio-and-strapi-formations-initiales.repository";
import {
  FormationInitialeFixtureBuilder,
} from "@formations-initiales/test/chargement/fixture/formation-initiale-fixture.builder";
import {
  FormationInitialeHttpFixtureBuilder,
} from "@formations-initiales/test/chargement/fixture/formations-initiales-http.fixture-builder";

import { Logger, LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import {RecupererOffresExistantesErreur} from "@shared/src/infrastructure/gateway/flux.erreur";

const uuid = "081e4a7c-6c27-4614-a2dd-ecaad37b9073";
const localFileNameIncludingPath = `./tmp/${uuid}`;
const filePathForMinio = "source/nom-du-fichier";

let nomDuFlux: string;
let contenu: string;
let formationInitialesACharger: Array<UnJeuneUneSolution.FormationInitialeASauvegarder>;

let configuration: StubbedType<Configuration>;
let minioClient: StubbedClass<Client>;
let fileSystemClient: StubbedType<FileSystemClient>;
let uuidGenerator: StubbedType<UuidGenerator>;
let httpClient: StubbedType<HttpClient>;
let loggerStrategy: StubbedType<LoggerStrategy>;
let logger: StubbedType<Logger>;
let minioAndStrapiFormationsInitialesRepository: MinioAndStrapiFormationsInitialesRepository;

describe("MinioAndStrapiFormationsInitialesRepository", () => {
  beforeEach(() => {
    nomDuFlux = "source";

    configuration = stubInterface<Configuration>(sinon);
    configuration = stubInterface<Configuration>(sinon);
    configuration.MINIO.TRANSFORMED_BUCKET_NAME = "json";
    configuration.MINIO.TRANSFORMED_FILE_EXTENSION = ".json";
    configuration.MINIO.RESULT_BUCKET_NAME = "result";
    configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";

    minioClient = stubClass(Client);

    fileSystemClient = stubInterface<FileSystemClient>(sinon);

    uuidGenerator = stubInterface<UuidGenerator>(sinon);
    uuidGenerator.generate.returns(uuid);

    httpClient = stubInterface<HttpClient>(sinon);

    loggerStrategy = stubInterface<LoggerStrategy>(sinon);
    logger = stubInterface<Logger>(sinon);
    loggerStrategy.get.returns(logger);

    minioAndStrapiFormationsInitialesRepository = new MinioAndStrapiFormationsInitialesRepository(
      configuration,
      minioClient,
      httpClient,
      fileSystemClient,
      uuidGenerator,
      loggerStrategy
    );
  });

  context("chargerLesFormationsInitialesDansLeCMS", () => {
    context("Lorsque je n'ai pas de formations initiales à charger", () => {
      beforeEach(() => {
        formationInitialesACharger = [];
      });

      it("je ne renvoie pas d'erreur", () => {
        expect(async () => minioAndStrapiFormationsInitialesRepository.chargerLesFormationsInitialesDansLeCMS(formationInitialesACharger, nomDuFlux)
        ).to.not.throw();
      });

      it("je retourne un tableau vide", async () => {
        const result = await minioAndStrapiFormationsInitialesRepository.chargerLesFormationsInitialesDansLeCMS(formationInitialesACharger, nomDuFlux);

        expect(result).to.be.empty;
      });
    });
    context("Lorsque j'ai des formations initiales à charger", () => {
      beforeEach(() => {
        formationInitialesACharger = [
          FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder(),
          FormationInitialeFixtureBuilder.buildFormationsInitialesASauvegarder(),
        ];
      });

      it("charge les formations initiales dans le CMS", async () => {
        // When
        await minioAndStrapiFormationsInitialesRepository.chargerLesFormationsInitialesDansLeCMS(formationInitialesACharger, nomDuFlux);

        // Then
        expect(httpClient.post).to.have.been.calledTwice;
        expect(httpClient.post.getCall(0).args).to.deep.equal([
          formationInitialesACharger[0],
        ]);
        expect(httpClient.post.getCall(1).args).to.deep.equal([
          formationInitialesACharger[1],
        ]);
      });

      context("Lorsque le chargement des formations initiales dans le CMS est un succès", () => {
        beforeEach(() => {
          httpClient.post.resolves();
        });
        it("ne renvoie pas de formations initiales en erreur", async () => {
          // When
          const result = await minioAndStrapiFormationsInitialesRepository.chargerLesFormationsInitialesDansLeCMS(formationInitialesACharger, nomDuFlux);

          // Then
          expect(result).to.deep.equal([]);
        });
      });

      context("Lorsque le chargement des formations initiales dans le CMS est un échec", () => {
        beforeEach(() => {
          httpClient.post.onFirstCall().resolves();
          httpClient.post.onSecondCall().rejects(new Error("Une erreur est survenue lors de l‘action demandée"));
        });
        it("renvoie les formations initiales en erreur", async () => {
          // When
          const result = await minioAndStrapiFormationsInitialesRepository.chargerLesFormationsInitialesDansLeCMS(formationInitialesACharger, nomDuFlux);

          // Then
          expect(result).to.deep.equal([
            FormationInitialeFixtureBuilder.buildFormationsInitialesEnErreur(
              formationInitialesACharger[1],
              "Une erreur est survenue lors de l‘action demandée",
            ),
          ]);
        });
      });
    });
  });

  context("recupererFormationsInitialesASupprimer", () => {
    it("appelle le CMS pour récupérer les formations initiales", async () => {
      // Given
      httpClient.getAll.resolves([FormationInitialeHttpFixtureBuilder.build()]);

      // When
      await minioAndStrapiFormationsInitialesRepository.recupererFormationsInitialesASupprimer(nomDuFlux);

      // Then
      expect(httpClient.getAll).to.have.been.calledOnce;
    });

    it("renvoie les formations initiales à supprimer", async () => {
      // Given
      const formationInitialeHttp = FormationInitialeHttpFixtureBuilder.build();
      httpClient.getAll.resolves([formationInitialeHttp]);

      // When
      const result = await minioAndStrapiFormationsInitialesRepository.recupererFormationsInitialesASupprimer(nomDuFlux);

      // Then
      expect(result).to.deep.equal([
        FormationInitialeFixtureBuilder.buildFormationsInitialesASupprimer(formationInitialeHttp),
      ]);
    });

    context("Lorsque le chargement des formations initiales dans le CMS est un échec", () => {
      it("throw une erreur", async () => {
        // Given
        httpClient.getAll.rejects(new Error("Une erreur est survenue lors de l‘action demandée"));

        // Then
        await expect(minioAndStrapiFormationsInitialesRepository.recupererFormationsInitialesASupprimer(nomDuFlux)).to.be.rejectedWith(new RecupererOffresExistantesErreur().message);
      });
    });
  });
});
