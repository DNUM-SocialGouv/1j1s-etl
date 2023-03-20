import { Module, Scope } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";
import TurndownService from "turndown";

import { DateService } from "@shared/src/domain/service/date.service";
import { AuthenticationClient } from "@shared/src/infrastructure/gateway/authentication.client";
import { FtpClient } from "@shared/src/infrastructure/gateway/client/ftp.client";
import { StrapiHttpClient } from "@shared/src/infrastructure/gateway/client/strapi-http-client";
import { StreamZipClient } from "@shared/src/infrastructure/gateway/client/stream-zip.client";
import {
	FileSystemClient,
	NodeFileSystemClient,
} from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { CountryToIso } from "@shared/src/infrastructure/gateway/country-to-iso";
import { HtmlToMarkdownSanitizer } from "@shared/src/infrastructure/gateway/html-to-markdown.sanitizer";
import { UnzipClient } from "@shared/src/infrastructure/gateway/unzip.client";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env" })],
	providers: [
		{
			provide: "AssainisseurDeTexte",
			useValue: new HtmlToMarkdownSanitizer(new TurndownService()),
		},
		{
			provide: "AxiosInstance",
			scope: Scope.TRANSIENT,
			useValue: axios.create({ maxBodyLength: Infinity, maxContentLength: Infinity }),
		},
		{
			provide: Client,
			inject: [ConfigService],
			useFactory: (configurationService: ConfigService): Client => {
				return new Client({
					accessKey: configurationService.get<string>("MINIO_ACCESS_KEY"),
					endPoint: configurationService.get<string>("MINIO_URL"),
					port: Number(configurationService.get<string>("MINIO_PORT")),
					secretKey: configurationService.get<string>("MINIO_SECRET_KEY"),
					useSSL: Shared.toBoolean(configurationService.get<string>("MINIO_USE_SSL")),
				});
			},
		},
		FtpClient,
		DateService,
		{
			provide: "FileSystemClient",
			inject: [ConfigService],
			useFactory: (configService: ConfigService): FileSystemClient => {
				return new NodeFileSystemClient(configService.get<string>("TEMPORARY_DIRECTORY_PATH"));
			},
		},
		JsonContentParser,
		{
			provide: "Pays",
			useValue: new CountryToIso(),
		},
		{
			provide: StrapiHttpClient,
			inject: [ConfigService],
			useFactory: (configurationService: ConfigService): StrapiHttpClient => {
				const authUrl = configurationService.get<string>("STRAPI_AUTHENTICATION_URL");
				const strapiCredentials = {
					password: configurationService.get<string>("STRAPI_PASSWORD"),
					username: configurationService.get<string>("STRAPI_USERNAME"),
				};
				const authenticationClient = new AuthenticationClient(authUrl, strapiCredentials);
				const axiosInstance = axios.create({
					baseURL: configurationService.get<string>("STRAPI_BASE_URL"),
				});
				return new StrapiHttpClient(axiosInstance, authenticationClient);
			},
		},
		StreamZipClient,
		UnzipClient,
		{
			provide: "UuidGenerator",
			useValue: new NodeUuidGenerator(),
		},
	],
	exports: [
		"AssainisseurDeTexte",
		"AxiosInstance",
		Client,
		DateService,
		FtpClient,
		"FileSystemClient",
		JsonContentParser,
		"Pays",
		StrapiHttpClient,
		StreamZipClient,
		UnzipClient,
		"UuidGenerator",
	],
})
export class Shared {
	private static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}
}
