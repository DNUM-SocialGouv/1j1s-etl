import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { Configuration } from "@evenements/chargement/configuration/configuration";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { Client } from "minio";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { Logger, LoggerStrategy } from "@shared/configuration/logger";
import {
    MinioAndStrapiEvenementsRepository,
} from "@evenements/chargement/infrastructure/gateway/repository/minio-and-strapi-evenements.repository";
import sinon from "sinon";
import { JsonContentParser } from "@shared/infrastructure/gateway/content.parser";
import {
    aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre,
    aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges,
    aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges,
} from "@test/evenements/fixture/tous-mobilises.fixture";
import {
    EcritureFluxErreur,
    RecupererContenuErreur,
    RecupererOffresExistantesErreur,
} from "@shared/infrastructure/gateway/flux.erreur";
import { DateService } from "@shared/date.service";
import {
    StrapiEvenementHttpClient,
} from "@evenements/chargement/infrastructure/gateway/repository/strapi-evenement-http-client";
import { UnjeuneUneSolutionChargement } from "@evenements/chargement/domain/1jeune1solution";
import { UuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";

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
        configuration.FEATURE_FLIPPING_CHARGEMENT = false;
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
            strapiEvenementHttpClient.getAll.resolves(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges());
        });
        describe("et que j'arrive a récupérer le fichier depuis le bucket", () => {
            it("je retourne une liste d'évenement depuis le bucket ou on stocke les résultats de chargement puis je supprime le fichier temporaire", async () => {
                const result = await repo.recupererEvenementsDejaCharges(nomFlux);

                expect(result).to.deep.equal(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges());
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
            fileSystemClient.read.resolves(JSON.stringify(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges()));
        });
        describe("et que j'arrive a récupérer le fichier depuis le bucket", () => {
            it("je retourne une liste d'évenement depuis le bucket ou on stocke les résultats de la transformation puis je supprime le fichier temporaire", async () => {
                const result = await repo.recupererNouveauxEvenementsACharger(nomFlux);

                expect(result).to.deep.equal(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges());
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
            const evenementAAjouter: UnjeuneUneSolutionChargement.EvenementAAjouter = {
                dateDebut: "2022-11-24T08:30:00",
                description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
                idSource: "272510",
                lieuEvenement: "Clermont",
                modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
                online: false,
                organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
                titreEvenement: "Pôle emploi - LACTALIS",
                typeEvenement: "seance_information",
                source: "tous-mobilises",
                dateFin: "2022-11-24T16:15:00",
            };

            it("je dois faire un post sur strapi avec l'évenement à ajouter", async () => {
                await repo.chargerEtEnregistrerLesErreurs([evenementAAjouter], [], []);

                expect(strapiEvenementHttpClient.post).to.have.been.calledWith(evenementAAjouter);
            });

            describe("mais que strapi tombe en erreur", () => {
                beforeEach(() => {
                    strapiEvenementHttpClient.post.rejects();
                });

                it("je dois retourner une liste d'évenement qui n'ont pas été réussi a etre chargé", async () => {
                    const result = await repo.chargerEtEnregistrerLesErreurs([evenementAAjouter], [], []);

                    expect(result).to.deep.equal([evenementAAjouter]);
                });
            });
        });

        context("et que j'ai des évenements a mettre à jour", () => {
            const evenementAMettreAJour: UnjeuneUneSolutionChargement.EvenementAMettreAJour = {
                id: 1,
                dateDebut: "2022-11-24T08:30:00",
                description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
                idSource: "272510",
                lieuEvenement: "Clermont",
                modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
                online: false,
                organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
                titreEvenement: "Pôle emploi - LACTALIS",
                typeEvenement: "seance_information",
                source: "tous-mobilises",
                dateFin: "2022-11-24T16:15:00",
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
            const evenementASupprimer: UnjeuneUneSolutionChargement.EvenementASupprimer = {
                id: 1,
                dateDebut: "2022-11-24T08:30:00",
                description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
                idSource: "272510",
                lieuEvenement: "Clermont",
                modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
                online: false,
                organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
                titreEvenement: "Pôle emploi - LACTALIS",
                typeEvenement: "seance_information",
                source: "tous-mobilises",
                dateFin: "2022-11-24T16:15:00",
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
            await repo.sauvegarder("nomFlux", "suffixHistoryFile", aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre());

            expect(uuidGenerator.generate).to.have.been.calledOnce;
            expect(fileSystemClient.write).to.have.been.calledOnce;
            expect(fileSystemClient.write).to.have.been.calledWith("./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073", JSON.stringify(aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre()));
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
                await expect(repo.sauvegarder("nomFlux", "suffixHistoryFile", aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre())).to.be.rejectedWith(
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
                await expect(repo.sauvegarder("nomFlux", "suffixHistoryFile", aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre())).to.be.rejectedWith(
                  EcritureFluxErreur,
                  "Le flux nomFlux n'a pas été extrait car une erreur d'écriture est survenue",
                );
                expect(fileSystemClient.delete).to.have.been.calledOnce;
                expect(fileSystemClient.delete).to.have.been.calledWith("./tmp/081e4a7c-6c27-4614-a2dd-ecaad37b9073");
            });
        });
    });
});