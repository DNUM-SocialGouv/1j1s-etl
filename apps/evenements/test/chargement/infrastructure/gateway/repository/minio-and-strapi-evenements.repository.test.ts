import { Client } from "minio";

import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import { Configuration } from "@evenements/src/chargement/infrastructure/configuration/configuration";
import {
    StrapiEvenementHttpClient,
} from "@evenements/src/chargement/infrastructure/gateway/client/strapi-evenement-http-client";
import {
    MinioAndStrapiEvenementsRepository,
} from "@evenements/src/chargement/infrastructure/gateway/repository/minio-and-strapi-evenements.repository";
import {
    evenement1Le24Novembre, evenement2Le24Novembre,
    evenementDejaCharge1Le24Novembre,
    evenementDejaCharge1Le25Novembre,
    evenementDejaCharge2Le24Novembre, evenementDejaCharge2Le25Novembre,
} from "@evenements/test/fixture/evenements-un-jeune-une-solution.fixture";

import { DateService } from "@shared/src/domain/service/date.service";
import { Logger, LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import {
    EcritureFluxErreur,
    RecupererContenuErreur,
    RecupererOffresExistantesErreur,
} from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@shared/test/configuration";

const uuid = "081e4a7c-6c27-4614-a2dd-ecaad37b9073";

describe("MinioAndStrapiEvenementsRepositoryTest", () => {

    const contentParser = new JsonContentParser();
    const nomFlux = "eventsflux";
    let configuration: StubbedType<Configuration>;
    let minioClient: StubbedClass<Client>;
    let strapiEvenementHttpClient: StubbedClass<StrapiEvenementHttpClient>;
    let fileSystemClient: StubbedType<FileSystemClient>;
    let uuidGenerator: StubbedType<UuidGenerator>;
    let loggerStrategy: StubbedType<LoggerStrategy>;
    let logger: StubbedType<Logger>;
    let dateService: StubbedClass<DateService>;

    let repo: MinioAndStrapiEvenementsRepository;

    beforeEach(() => {
        configuration = stubInterface<Configuration>(sinon);
        configuration.MINIO.TRANSFORMED_BUCKET_NAME = "json";
        configuration.MINIO.TRANSFORMED_FILE_EXTENSION = ".json";
        configuration.MINIO.RESULT_BUCKET_NAME = "result";
        configuration.TEMPORARY_DIRECTORY_PATH = "./tmp/";
        configuration.TOUS_MOBILISES.TRANSFORMED_FILE_EXTENSION = ".json";

        minioClient = stubClass(Client);

        fileSystemClient = stubInterface<FileSystemClient>(sinon);

        uuidGenerator = stubInterface<UuidGenerator>(sinon);
        uuidGenerator.generate.returns(uuid);

        strapiEvenementHttpClient = stubClass(StrapiEvenementHttpClient);

        loggerStrategy = stubInterface<LoggerStrategy>(sinon);
        logger = stubInterface<Logger>(sinon);
        loggerStrategy.get.returns(logger);

        dateService = stubClass(DateService);
        dateService.maintenant.returns(new Date("2022-01-01T00:00:00.000Z"));

        repo = new MinioAndStrapiEvenementsRepository(
            minioClient,
            strapiEvenementHttpClient,
            configuration,
            fileSystemClient,
            contentParser,
            loggerStrategy,
            uuidGenerator,
            dateService
        );
    });

    context("Lorsque je veux récupérer les derniers évenements qui ont été chargé", () => {
        beforeEach(() => {
            strapiEvenementHttpClient.getAll.resolves([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre]);
        });
        describe("et que j'arrive a récupérer le fichier depuis le bucket", () => {
            it("je retourne une liste d'évenement depuis le bucket ou on stocke les résultats de chargement puis je supprime le fichier temporaire", async () => {
                const result = await repo.recupererEvenementsDejaCharges(nomFlux);

                expect(result).to.deep.equal([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre]);
            });
        });

        describe("mais que je n'arrive pas a récupérer le fichier depuis le bucket", () => {
            beforeEach(() => {
                strapiEvenementHttpClient.getAll.rejects();
            });

            it("je retourne une erreur", async () => {
                await expect(repo.recupererEvenementsDejaCharges(nomFlux)).to.be.rejectedWith(
                    RecupererOffresExistantesErreur,
                    "Une erreur est survenue lors de la récupération des offres existantes",
                );
            });
        });

    });

    context("Lorsque je veux récupérer les derniers évenements a chargé", () => {
        beforeEach(() => {
            fileSystemClient.read.resolves(JSON.stringify([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]));
        });
        describe("et que j'arrive a récupérer le fichier depuis le bucket", () => {
            it("je retourne une liste d'évenement depuis le bucket ou on stocke les résultats de la transformation puis je supprime le fichier temporaire", async () => {
                const result = await repo.recupererNouveauxEvenementsACharger(nomFlux);

                expect(result).to.deep.equal([evenementDejaCharge1Le24Novembre, evenementDejaCharge2Le24Novembre, evenementDejaCharge1Le25Novembre, evenementDejaCharge2Le25Novembre]);
                expect(minioClient.fGetObject).to.have.been.calledWith("json", "eventsflux/latest.json", "./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073");
                expect(fileSystemClient.delete).to.have.been.calledWith("./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073");
            });
        });

        describe("mais que je n'arrive pas a récupérer le fichier depuis le bucket", () => {
            beforeEach(() => {
                minioClient.fGetObject.rejects(new Error("failed to get file"));
            });

            it("je retourne une erreur", async () => {
                await expect(repo.recupererNouveauxEvenementsACharger(nomFlux)).to.be.rejectedWith(
                    RecupererContenuErreur,
                    "Une erreur de lecture ou de parsing est survenue lors de la récupération du contenu",
                );
            });
        });

    });

    context("Lorsque je veux charger des données", () => {
        context("et que j'ai des évenements a ajouter", () => {
            it("je dois faire un post sur strapi avec l'évenement à ajouter", async () => {
                await repo.chargerEtEnregistrerLesErreurs([evenement1Le24Novembre], [], []);

                expect(strapiEvenementHttpClient.post).to.have.been.calledWith(evenement1Le24Novembre);
            });

            describe("mais que strapi tombe en erreur", () => {
                beforeEach(() => {
                    strapiEvenementHttpClient.post.rejects();
                });

                it("je dois retourner une liste d'évenement qui n'ont pas été réussi a etre chargé", async () => {
                    const result = await repo.chargerEtEnregistrerLesErreurs([evenement1Le24Novembre], [], []);

                    expect(result).to.deep.equal([evenement1Le24Novembre]);
                });
            });
        });

        context("et que j'ai des évenements a mettre à jour", () => {
            const evenementAMettreAJour: UnJeuneUneSolution.EvenementAMettreAJour = {
                id: 1,
                ...evenement1Le24Novembre,
            };

            it("je dois faire un post sur strapi avec l'évenement à ajouter", async () => {
                await repo.chargerEtEnregistrerLesErreurs([], [evenementAMettreAJour], []);

                expect(strapiEvenementHttpClient.put).to.have.been.calledWith(evenementAMettreAJour);
            });

            describe("mais que strapi tombe en erreur", () => {
                beforeEach(() => {
                    strapiEvenementHttpClient.put.rejects();
                });

                it("je dois retourner une liste d'évenement qui n'ont pas été réussi a etre chargé", async () => {
                    const result = await repo.chargerEtEnregistrerLesErreurs([], [evenementAMettreAJour], []);

                    expect(result).to.deep.equal([evenementAMettreAJour]);
                });
            });
        });

        context("et que j'ai des évenements a supprimer", () => {
            const evenementASupprimer: UnJeuneUneSolution.EvenementASupprimer = {
                id: 1,
                ...evenement1Le24Novembre,
            };

            it("je dois faire un post sur strapi avec l'évenement à ajouter", async () => {
                await repo.chargerEtEnregistrerLesErreurs([], [], [evenementASupprimer]);

                expect(strapiEvenementHttpClient.delete).to.have.been.calledWith(evenementASupprimer);
            });

            describe("mais que strapi tombe en erreur", () => {
                beforeEach(() => {
                    strapiEvenementHttpClient.put.rejects();
                });

                it("je dois retourner une liste d'évenement qui n'ont pas été réussi a etre chargé", async () => {
                    const result = await repo.chargerEtEnregistrerLesErreurs([], [], [evenementASupprimer]);

                    expect(result).to.deep.equal([]);
                });
            });
        });
    });

    context("Lorsque je veux sauvegarder sur le minio", () => {
        it("j'écris avec le contenu des évènements", async () => {
            await repo.sauvegarder("nomFlux", "suffixHistoryFile", [evenement1Le24Novembre, evenement2Le24Novembre ]);

            expect(uuidGenerator.generate).to.have.been.calledOnce;
            expect(fileSystemClient.write).to.have.been.calledOnce;
            expect(fileSystemClient.write).to.have.been.calledWith("./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073", JSON.stringify([evenement1Le24Novembre, evenement2Le24Novembre ]));
            expect(minioClient.fPutObject).to.have.been.calledOnce;
            expect(minioClient.fPutObject).to.have.been.calledWith(
              configuration.MINIO.RESULT_BUCKET_NAME,
              "nomFlux/2022-01-01T00:00:00.000Z_suffixHistoryFile.json",
              "./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073",
            );
            expect(fileSystemClient.delete).to.have.been.calledOnce;
            expect(fileSystemClient.delete).to.have.been.calledWith("./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073");
        });

        context("Lorsque je n'arrive pas à écrire le fichier chez moi", () => {
            beforeEach(() => {
                fileSystemClient.write.rejects();
            });

            it("je lance une erreur", async () => {
                await expect(repo.sauvegarder("nomFlux", "suffixHistoryFile", [evenement1Le24Novembre, evenement2Le24Novembre ])).to.be.rejectedWith(
                  EcritureFluxErreur,
                  "Le flux nomFlux n'a pas été extrait car une erreur d'écriture est survenue",
                );
            });
        });

        context("Lorsque j'écris le contenu d'un fichier dont je ne trouve pas le dossier racine ou que le nouveau nom du" +
          " fichier est invalide", () => {
            beforeEach(() => {
                minioClient.fPutObject.rejects();
            });

            it("je lance une erreur", async () => {
                await expect(repo.sauvegarder("nomFlux", "suffixHistoryFile", [evenement1Le24Novembre, evenement2Le24Novembre ])).to.be.rejectedWith(
                  EcritureFluxErreur,
                  "Le flux nomFlux n'a pas été extrait car une erreur d'écriture est survenue",
                );
                expect(fileSystemClient.delete).to.have.been.calledOnce;
                expect(fileSystemClient.delete).to.have.been.calledWith("./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073");
            });
        });
    });
});
