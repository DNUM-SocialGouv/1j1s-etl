import { UnJeuneUneSolution } from "@evenements/chargement/domain/1jeune1solution";
import { Client } from "minio";
import { Configuration } from "@evenements/chargement/configuration/configuration";
import { LoggerStrategy } from "@shared/configuration/logger";
import { DateService } from "@shared/date.service";
import {
    StrapiEvenementHttpClient,
} from "@evenements/chargement/infrastructure/gateway/repository/strapi-evenement-http-client";
import { UuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";

export class FeatureFlippingEvenementsRepository implements UnJeuneUneSolution.EvenementsRepository {
    private readonly LATEST_FILE_NAME = "latest";

    constructor(
        private readonly minioClient: Client,
        private readonly strapiEvenementHttpClient: StrapiEvenementHttpClient,
        private readonly configuration: Configuration,
        protected readonly loggerStrategy: LoggerStrategy,
        protected readonly uuidGenerator: UuidGenerator,
        protected readonly dateService: DateService,
    ) {}


    public async chargerEtEnregistrerLesErreurs(evenenementsAAjouter: Array<UnJeuneUneSolution.EvenementAAjouter>, evenementsAMettreAjour: Array<UnJeuneUneSolution.EvenementAMettreAJour>, evenementsASupprimer: Array<UnJeuneUneSolution.EvenementASupprimer>): Promise<Array<UnJeuneUneSolution.Evenement>> {
        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements à publier : ${evenenementsAAjouter.length}`);
        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements à mettre à jour : ${evenementsAMettreAjour.length}`);
        this.loggerStrategy.get("tous-mobilises").info(`Nombre d'évenements à supprimer : ${evenementsASupprimer.length}`);
        return Promise.resolve([]);
    }

    public async recupererNouveauxEvenementsACharger(nomFlux: string): Promise<Array<UnJeuneUneSolution.Evenement>> {
        const sourceFilePath = `${nomFlux}/${this.LATEST_FILE_NAME}${this.configuration.MINIO.TRANSFORMED_FILE_EXTENSION}`;
        this.loggerStrategy.get(nomFlux).info(`Starting to pull newest events to load from flow on ${sourceFilePath}`);

        return Promise.resolve([]);
    }

    public async recupererEvenementsDejaCharges(nomFlux: string): Promise<Array<UnJeuneUneSolution.EvenementDejaCharge>> {
        this.loggerStrategy.get(nomFlux).info(`Starting to pull last events loaded from flow ${nomFlux}`);
        return Promise.resolve([]);
    }

    public async sauvegarder(nomFlux: string, suffixHistoryFile: string, evenements: Array<UnJeuneUneSolution.Evenement>): Promise<void> {
        this.loggerStrategy.get(nomFlux).info(`Number of element to save ${evenements.length}`);
        this.loggerStrategy.get(nomFlux).info(`Starting to save flow ${nomFlux}/${this.dateService.maintenant().toISOString()}_${suffixHistoryFile}${this.configuration.TOUS_MOBILISES.TRANSFORMED_FILE_EXTENSION}`);
        return Promise.resolve();
    }
}
