import axios from "axios";
import { Client } from "minio";

import { AuthenticationClient } from "@shared/infrastructure/gateway/authentication.client";
import { Configuration } from "@evenements/chargement/configuration/configuration";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { EvenementsChargementLoggerStrategy } from "@evenements/chargement/configuration/logger-strategy";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";
import { GatewayContainer } from "@evenements/chargement/infrastructure/gateway";
import {
	StrapiEvenementHttpClient,
} from "@evenements/chargement/infrastructure/gateway/repository/strapi-evenement-http-client";
import {
	MinioAndStrapiEvenementsRepository,
} from "@evenements/chargement/infrastructure/gateway/repository/minio-and-strapi-evenements.repository";
import { JsonContentParser } from "@shared/infrastructure/gateway/content.parser";
import { DateService } from "@shared/date.service";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: EvenementsChargementLoggerStrategy): GatewayContainer {
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const uuidGenerator = new NodeUuidGenerator();
		const axiosInstance = axios.create({
			baseURL: configuration.STRAPI.BASE_URL,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});
		const authenticationClient = new AuthenticationClient(
			configuration.STRAPI.AUTHENTICATION_URL,
			{ username: configuration.STRAPI.USERNAME, password: configuration.STRAPI.PASSWORD },
		);
		const strapiEvenementHttpClient = new StrapiEvenementHttpClient(
			axiosInstance,
			authenticationClient,
			configuration.STRAPI.EVENEMENT_URL
		);

		return {
			evenementsRepository: new MinioAndStrapiEvenementsRepository(
				minioClient,
				strapiEvenementHttpClient,
				configuration,
				new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH),
				new JsonContentParser(),
				loggerStrategy,
				uuidGenerator,
				new DateService(),
			),
		};
	}
}
