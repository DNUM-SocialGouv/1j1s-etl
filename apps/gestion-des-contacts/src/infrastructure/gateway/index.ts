import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AxiosInstance } from "axios";
import { Client } from "minio";

import {
	Configuration,
	ConfigurationFactory,
} from "@gestion-des-contacts/src/infrastructure/configuration/configuration";
import {
	HttpMinioContactCejRepository,
} from "@gestion-des-contacts/src/infrastructure/gateway/repository/http-minio-contact-cej.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerFactory } from "@shared/src/infrastructure/configuration/logger";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi/strapi-http-client";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Shared,
	],
	providers: [
		{
			provide: "ContactCejRepository",
			inject: [ConfigService, StrapiHttpClient, Client, DateService, "FileSystemClient", "AxiosInstance"],
			useFactory: (
				configurationService: ConfigService,
				strapiHttpClient: StrapiHttpClient,
				minioClient: Client,
				dateService: DateService,
				fileSystemClient: FileSystemClient,
				httpClient: AxiosInstance,
			): HttpMinioContactCejRepository => {
				const configuration = configurationService.get<Configuration>("gestionDesContacts");
				const loggerFactory = new LoggerFactory(
					configuration.SENTRY.DSN, configuration.SENTRY.PROJECT, configuration.SENTRY.RELEASE,
					configuration.ENVIRONMENT, configuration.CONTEXT, configuration.LOG_LEVEL, configuration.CONTACTS_CEJ.DOMAINE,
				);
				const logger = loggerFactory.create({ name: "gestion-des-contacts" });

				return new HttpMinioContactCejRepository(strapiHttpClient, minioClient, dateService, fileSystemClient, httpClient, configuration, logger);
			},
		},
	],
	exports: ["ContactCejRepository"],
})
export class Gateways {
}
