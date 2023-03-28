import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Client } from "minio";

import { ContactPoe } from "@gestion-des-contacts/src/domain/model/contact-poe";
import { ContactPoeRepository } from "@gestion-des-contacts/src/domain/service/contact-poe.repository";
import { Configuration } from "@gestion-des-contacts/src/infrastructure/configuration/configuration";

import { DateService } from "@shared/src/domain/service/date.service";
import { Logger } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";

export type StrapiContactPoe = {
    id: string;
    nom_societe: string;
    code_postal: string;
    ville: string;
    siret: string;
    taille: string;
    secteur: string;
    prenom: string;
    telephone: string;
    nom: string;
    travail: string;
    erreur: string;
    nombreARecruter: string;
    commentaire: string;
    email: string;
    createdAt: string;
}

export class HttpMinioContactPoeRepository implements ContactPoeRepository {
    private static readonly FIELDS_TO_RETRIEVE = "nom_societe,code_postal,ville,siret,taille,secteur,prenom,telephone,nom,travail,erreur,nombreARecruter,commentaire,email,createdAt";
    private static readonly RELATIONS_TO_RETRIEVE = "";
    private static readonly CSV_HEADERS: Array<Record<"id" | "title", string>> = [
        { id: "dateDeCreation", title: "Date de création" },
        { id: "nomSociete", title: "Nom Société" },
        { id: "taille", title: "Taille" },
        { id: "siret", title: "Siret" },
        { id: "secteur", title: "Secteur" },
        { id: "codePostal", title: "Code postal" },
        { id: "ville", title: "Ville" },
        { id: "nom", title: "Nom" },
        { id: "prenom", title: "Prénom" },
        { id: "email", title: "Email" },
        { id: "telephone", title: "Téléphone" },
        { id: "travail", title: "Travail" },
        { id: "nombreARecruter", title: "Nombre à recruter" },
        { id: "commentaire", title: "Commentaire" },
        { id: "erreur", title: "Erreur" },
    ];

    constructor(
        private readonly strapiHttpClient: StrapiHttpClient,
        private readonly minioClient: Client,
        private readonly dateService: DateService,
        private readonly fileSystemClient: FileSystemClient,
        private readonly httpClient: AxiosInstance,
        private readonly configuration: Configuration,
        private readonly logger: Logger,
    ) {
    }

    public async envoyerLesContactsPoeAPoleEmploi(contactsPoe: Array<ContactPoe>): Promise<void> {
        const now = this.dateService.maintenant();
        const fileName = this.buildFileName(now);
        const fileNameIncludingPath = `${this.configuration.TEMPORARY_DIRECTORY_PATH}/${fileName}`;

        try {
            const contactsPoeAsCsvBuffer = await this.formatToCsvBuffer(fileNameIncludingPath, contactsPoe);
            await this.createBackUpOnMinio(fileName, fileNameIncludingPath);
            await this.sendToPoleEmploi(contactsPoeAsCsvBuffer, fileName);
        } catch(error) {
            this.handleError(<Error>error);
        } finally {
            await this.fileSystemClient.delete(fileNameIncludingPath);
        }
    }

    public async recupererLesContactsPoe(): Promise<Array<ContactPoe>> {
        const { FIELDS_TO_RETRIEVE, RELATIONS_TO_RETRIEVE } = HttpMinioContactPoeRepository;
        const poeEndpoint = this.configuration.STRAPI.POE_ENDPOINT;

        const contactsPoe = await this.strapiHttpClient.get<StrapiContactPoe>(poeEndpoint, FIELDS_TO_RETRIEVE, RELATIONS_TO_RETRIEVE);

        return this.toContactsPoe(contactsPoe);
    }

    public async supprimerLesContactsEnvoyesAPoleEmploi(contactsPoe: Array<ContactPoe>): Promise<void> {
        const poeEndpoint = this.configuration.STRAPI.POE_ENDPOINT;

        for (const contactPoe of contactsPoe) {
            try {
                await this.strapiHttpClient.delete(poeEndpoint, contactPoe.id);
            } catch(error) {
                this.logger.info(`Deletion of contact poe with id=[${contactPoe.id}] has failed`);
            }
        }
    }

    private async formatToCsvBuffer(fileNameIncludingPath: string, contactsPoe: Array<ContactPoe>): Promise<Buffer> {
        await this.fileSystemClient.writeCsv(fileNameIncludingPath, contactsPoe, HttpMinioContactPoeRepository.CSV_HEADERS);
        return await this.fileSystemClient.read(fileNameIncludingPath);
    }

    private async sendToPoleEmploi(contactsPoeAsCsvBuffer: Buffer, fileName: string): Promise<void> {
        await this.httpClient.post(this.configuration.CONTACTS_POE.FILR_URL, contactsPoeAsCsvBuffer, this.buildParams(fileName));
    }

    private async createBackUpOnMinio(fileName: string, fileNameIncludingPath: string): Promise<void> {
        await this.minioClient.fPutObject(this.configuration.MINIO.BUCKET_NAME_EXPORT_POE, fileName, fileNameIncludingPath);
    }

    private buildFileName(now: Date): string {
        return this.dateService.toFormat(now, "yyMMdd").concat("_export_api-contact-poe.csv");
    }

    private buildParams(fileName: string): AxiosRequestConfig {
        return {
            auth: {
                username: this.configuration.FILR.USERNAME,
                password: this.configuration.FILR.PASSWORD,
            },
            headers: { "Content-Type": "application/octet-stream" },
            params: { file_name: fileName },
        };
    }

    private handleError(error: Error): void {
        const extra = { error: JSON.stringify(error) };

        if (error instanceof AxiosError) {
            this.logger.error({ msg: "L'envoi du fichier des contacts POE à Pôle Emploi a échoué", extra });
        } else {
            this.logger.error({ msg: "Une erreur d'écriture est survenue avant l'envoi du fichier des contacts POE", extra });
        }

        throw error;
    }

    private toContactsPoe(strapiContactsPoe: Array<StrapiContactPoe>): Array<ContactPoe> {
        return strapiContactsPoe.map((strapiContactPoe) => this.toContactPoe(strapiContactPoe));
    }

    private toContactPoe(strapiContactPoe: StrapiContactPoe): ContactPoe {
        return {
            id: strapiContactPoe.id,
            nomSociete: strapiContactPoe.nom_societe,
            codePostal: strapiContactPoe.code_postal,
            ville: strapiContactPoe.ville,
            siret: strapiContactPoe.siret,
            taille: strapiContactPoe.taille,
            secteur: strapiContactPoe.secteur,
            prenom: strapiContactPoe.prenom,
            telephone: strapiContactPoe.telephone,
            nom: strapiContactPoe.nom,
            travail: strapiContactPoe.travail,
            erreur: strapiContactPoe.erreur,
            nombreARecruter: strapiContactPoe.nombreARecruter,
            commentaire: strapiContactPoe.commentaire,
            email: strapiContactPoe.email,
            dateDeCreation: strapiContactPoe.createdAt,
        };
    }
}
