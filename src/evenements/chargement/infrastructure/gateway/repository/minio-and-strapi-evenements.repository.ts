import { UnjeuneUneSolutionChargement } from "@evenements/chargement/domain/1jeune1solution";
import { Client } from "minio";
import { Configuration } from "@evenements/chargement/configuration/configuration";
import { ContentParser } from "@shared/infrastructure/gateway/content.parser";
import { RecupererContenuErreur, RecupererOffresExistantesErreur } from "@shared/infrastructure/gateway/flux.erreur";
import { LoggerStrategy } from "@shared/configuration/logger";
import { UuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";
import { DateService } from "@shared/date.service";
import { FluxChargement } from "@evenements/chargement/domain/flux";
import {
    StrapiEvenementHttpClient,
} from "@evenements/chargement/infrastructure/gateway/repository/strapi-evenement-http-client";
import { FileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import Evenement = UnjeuneUneSolutionChargement.Evenement;
import axios from "axios";

export class MinioAndStrapiEvenementsRepository implements UnjeuneUneSolutionChargement.EvenementsRepository {
    private readonly LATEST_FILE_NAME = "latest";

    constructor(
        private readonly minioClient: Client,
        private readonly strapiEvenementHttpClient: StrapiEvenementHttpClient,
        private readonly configuration: Configuration,
        private readonly fileSystemClient: FileSystemClient,
        private readonly contentParser: ContentParser,
        protected readonly loggerStrategy: LoggerStrategy,
        protected readonly uuidGenerator: UuidGenerator,
        protected readonly dateService: DateService,
    ) {}


    async chargerEtEnregistrerLesErreurs(evenenementsAAjouter: UnjeuneUneSolutionChargement.EvenementAAjouter[], evenementsAMettreAjour: UnjeuneUneSolutionChargement.EvenementAMettreAJour[], evenementsASupprimer: UnjeuneUneSolutionChargement.EvenementASupprimer[]): Promise<UnjeuneUneSolutionChargement.Evenement[]> {
        const evenementsEnErreur: Evenement[] = [];
        if(this.configuration.FEATURE_FLIPPING_CHARGEMENT) {
            this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements à publier : ${evenenementsAAjouter.length}`);
            this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements à mettre à jour : ${evenementsAMettreAjour.length}`);
            this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements à supprimer : ${evenementsASupprimer.length}`);
            return Promise.resolve([]);
        }
        for (const evenenementAAjouter of evenenementsAAjouter) {
            try {
                await this.strapiEvenementHttpClient.post(evenenementAAjouter);
            } catch (e) {
                evenementsEnErreur.push(evenenementAAjouter);
            }
        }
        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements ayant été publié : ${evenenementsAAjouter.length}`);

        for (const evenementMettreAjour of evenementsAMettreAjour) {
            try {
                await this.strapiEvenementHttpClient.put(evenementMettreAjour);
            } catch (e) {
                evenementsEnErreur.push(evenementMettreAjour);
            }
        }
        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements ayant été mis à jour : ${evenementsAMettreAjour.length}`);

        for (const evenementASupprimer of evenementsASupprimer) {
            try {
                await this.strapiEvenementHttpClient.delete(evenementASupprimer);
            } catch (e) {
                evenementsEnErreur.push(evenementASupprimer);
            }
        }
        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements ayant été supprimé : ${evenementsASupprimer.length}`);

        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements tombé en erreur : ${evenementsEnErreur.length}`);
        return Promise.resolve(evenementsEnErreur);
    }

    async recupererNouveauxEvenementsACharger(nomFlux: string): Promise<UnjeuneUneSolutionChargement.Evenement[]> {
        const temporaryFileName = this.uuidGenerator.generate();
        const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);
        const sourceFilePath = `${nomFlux}/${this.LATEST_FILE_NAME}${this.configuration.MINIO.TRANSFORMED_FILE_EXTENSION}`;
        this.loggerStrategy.get(nomFlux).info(`Starting to pull newest events to load from flow on ${sourceFilePath}`);

        try {
            await this.minioClient.fGetObject(
                this.configuration.MINIO.TRANSFORMED_BUCKET_NAME,
                sourceFilePath,
                localFileNameIncludingPath
            );
            const fileContent = await this.fileSystemClient.read(localFileNameIncludingPath);
            const nouveauxEvenements = await this.contentParser.parse<UnjeuneUneSolutionChargement.Evenement[]>(fileContent.toString());
            this.loggerStrategy.get(nomFlux).info(`Number of newest events to pull ${nouveauxEvenements.length}`);
            return nouveauxEvenements;
        } catch (e) {
            if(axios.isAxiosError(e)) {
                throw new RecupererContenuErreur(e.stack);
            }
            throw new RecupererContenuErreur();
        } finally {
            await this.fileSystemClient.delete(localFileNameIncludingPath);
            this.loggerStrategy.get(nomFlux).info(`End of pulling newest events to load from flow ${nomFlux}`);
        }
    }

    async recupererEvenementsDejaCharges(source: string): Promise<UnjeuneUneSolutionChargement.EvenementDejaCharge[]> {
        this.loggerStrategy.get(source).info(`Starting to pull last events loaded from flow ${source}`);
        try {
           return await this.strapiEvenementHttpClient.getAll(source);
        } catch (e) {
            if(axios.isAxiosError(e)) {
                throw new RecupererOffresExistantesErreur(e.stack);
            }
            throw new RecupererOffresExistantesErreur();
        } finally {
            this.loggerStrategy.get(source).info(`End of pulling existing events offers from flow ${source}`);
        }
    }

    async sauvegarder(fluxChargement: FluxChargement, evenements: UnjeuneUneSolutionChargement.Evenement[]): Promise<void> {
        // TODO : gérer la sauvegarde des évenements en erreur
        return Promise.resolve();
    }
}