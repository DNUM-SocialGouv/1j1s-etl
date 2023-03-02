import axios from "axios";
import { Client } from "minio";

import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import { Configuration } from "@evenements/src/chargement/infrastructure/configuration/configuration";
import {
    StrapiEvenementHttpClient,
} from "@evenements/src/chargement/infrastructure/gateway/client/strapi-evenement-http-client";

import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { ContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import {
    EcritureFluxErreur,
    RecupererContenuErreur,
    RecupererOffresExistantesErreur,
} from "@shared/src/infrastructure/gateway/flux.erreur";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class MinioAndStrapiEvenementsRepository implements UnJeuneUneSolution.EvenementsRepository {
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
    public async chargerEtEnregistrerLesErreurs(
        evenementsAAjouter: Array<UnJeuneUneSolution.EvenementAAjouter>,
        evenementsAMettreAjour: Array<UnJeuneUneSolution.EvenementAMettreAJour>,
        evenementsASupprimer: Array<UnJeuneUneSolution.EvenementASupprimer>,
    ): Promise<Array<UnJeuneUneSolution.Evenement>> {

        const evenementsEnErreur: Array<UnJeuneUneSolution.Evenement> = [];
        for (const evenementAAjouter of evenementsAAjouter) {
            try {
                await this.strapiEvenementHttpClient.post(evenementAAjouter);
            } catch (e) {
                evenementsEnErreur.push(evenementAAjouter);
            }
        }

        for (const evenementMettreAjour of evenementsAMettreAjour) {
            try {
                await this.strapiEvenementHttpClient.put(evenementMettreAjour);
            } catch (e) {
                evenementsEnErreur.push(evenementMettreAjour);
            }
        }

        for (const evenementASupprimer of evenementsASupprimer) {
            try {
                await this.strapiEvenementHttpClient.delete(evenementASupprimer);
            } catch (e) {
                evenementsEnErreur.push(evenementASupprimer);
            }
        }

        return Promise.resolve(evenementsEnErreur);
    }

    public async recupererNouveauxEvenementsACharger(nomFlux: string): Promise<Array<UnJeuneUneSolution.Evenement>> {
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
            return await this.contentParser.parse<Array<UnJeuneUneSolution.Evenement>>(fileContent.toString());
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

    public async recupererEvenementsDejaCharges(nomFlux: string): Promise<Array<UnJeuneUneSolution.EvenementDejaCharge>> {
        this.loggerStrategy.get(nomFlux).info(`Starting to pull last events loaded from flow ${nomFlux}`);
        try {
           return await this.strapiEvenementHttpClient.getAll(nomFlux);
        } catch (e) {
            if(axios.isAxiosError(e)) {
                throw new RecupererOffresExistantesErreur(e.stack);
            }
            throw new RecupererOffresExistantesErreur();
        } finally {
            this.loggerStrategy.get(nomFlux).info(`End of pulling existing events offers from flow ${nomFlux}`);
        }
    }

    public async sauvegarder(nomFlux: string, suffixHistoryFile: string, evenements: Array<UnJeuneUneSolution.Evenement>): Promise<void> {
        this.loggerStrategy.get(nomFlux).info(`Starting to save flow ${nomFlux}`);
        const temporaryFileName = this.uuidGenerator.generate();
        const localFileNameIncludingPath = this.configuration.TEMPORARY_DIRECTORY_PATH.concat(temporaryFileName);

        try {
            await this.fileSystemClient.write(localFileNameIncludingPath, JSON.stringify(evenements));
            await this.minioClient.fPutObject(
              this.configuration.MINIO.RESULT_BUCKET_NAME,
              `${nomFlux}/${this.dateService.maintenant().toISOString()}_${suffixHistoryFile}${this.configuration.TOUS_MOBILISES.TRANSFORMED_FILE_EXTENSION}`,
              localFileNameIncludingPath
            );
        } catch (e) {
            throw new EcritureFluxErreur(nomFlux);
        } finally {
            await this.fileSystemClient.delete(localFileNameIncludingPath);
            this.loggerStrategy.get(nomFlux).info(`End of saving flow ${nomFlux}`);
        }
    }
}
