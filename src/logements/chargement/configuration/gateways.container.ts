
import {
    MinioHttpAnnonceDeLogementRepository,
} from "@logements/chargement/infrastructure/gateway/repository/minio-http-annonce-de-logement.repository";
import axios from "axios";
import { Client } from "minio";

import { Configuration } from "@logements/chargement/configuration/configuration";
import { GatewayContainer } from "@logements/chargement/infrastructure/gateway";
import { MinioStorageClient } from "../infrastructure/gateway/client/storage.client";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";
import { StrapiClient } from "../infrastructure/gateway/client/http.client";
import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import { DateService } from "@shared/date.service";
import { LoggerStrategy } from "@shared/configuration/logger";


export class GatewayContainerFactory {

    public static create(configuration: Configuration, loggerStrategy: LoggerStrategy): GatewayContainer {

        const dateService = new DateService();
        const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_FILE_PATH);
        const minioClient = new Client({
            accessKey: configuration.MINIO.ACCESS_KEY,
            secretKey: configuration.MINIO.SECRET_KEY,
            port: configuration.MINIO.PORT,
            endPoint: configuration.MINIO.URL,
        });
        const uuidClient = new NodeUuidGenerator();
        const axiosInstance = axios.create({
			baseURL: configuration.STRAPI.BASE_URL,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});

        const strapiCredentials = {
            username: configuration.STRAPI.USERNAME,
            password: configuration.STRAPI.PASSWORD,
        };

        const authClient = new AuthenticationClient(configuration.STRAPI.AUTHENTICATION_URL, strapiCredentials);

        const storageClient = new MinioStorageClient(configuration, fileSystemClient, minioClient, uuidClient);
        const httpClient = new StrapiClient(axiosInstance, configuration.STRAPI.BASE_URL, authClient);

        return {
            annonceDeLogementRepository: new MinioHttpAnnonceDeLogementRepository(storageClient, httpClient, dateService, loggerStrategy),
        };
    }

}
