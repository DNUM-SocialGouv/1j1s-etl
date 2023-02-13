import { Client } from "minio";
import { Configuration } from "@evenements/src/chargement/configuration/configuration";
import { DateService } from "@shared/src/date.service";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import {
    StrapiEvenementHttpClient,
} from "@evenements/src/chargement/infrastructure/gateway/client/strapi-evenement-http-client";
import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

export class FeatureFlippingEvenementsRepository implements UnJeuneUneSolution.EvenementsRepository {
    private readonly LATEST_FILE_NAME: string = "latest";

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
        return Promise.resolve([] as Array<UnJeuneUneSolution.Evenement>);
    }

    public async recupererNouveauxEvenementsACharger(nomFlux: string): Promise<Array<UnJeuneUneSolution.Evenement>> {
        const sourceFilePath = `${nomFlux}/${this.LATEST_FILE_NAME}${this.configuration.MINIO.TRANSFORMED_FILE_EXTENSION}`;
        this.loggerStrategy.get(nomFlux).info(`Starting to pull newest events to load from flow on ${sourceFilePath}`);

        return Promise.resolve([] as Array<UnJeuneUneSolution.Evenement>);
    }

    public async recupererEvenementsDejaCharges(nomFlux: string): Promise<Array<UnJeuneUneSolution.EvenementDejaCharge>> {
        this.loggerStrategy.get(nomFlux).info(`Starting to pull last events loaded from flow ${nomFlux}`);
        return Promise.resolve([] as Array<UnJeuneUneSolution.EvenementDejaCharge>);
    }

    public async sauvegarder(nomFlux: string, suffixHistoryFile: string, evenements: Array<UnJeuneUneSolution.Evenement>): Promise<void> {
        this.loggerStrategy.get(nomFlux).info(`Number of element to save ${evenements.length}`);
        this.loggerStrategy.get(nomFlux).info(`Starting to save flow ${nomFlux}/${this.dateService.maintenant().toISOString()}_${suffixHistoryFile}${this.configuration.TOUS_MOBILISES.TRANSFORMED_FILE_EXTENSION}`);
        return Promise.resolve();
    }
}
