import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import axios from "axios";
import { Client } from "minio";
import TurndownService from "turndown";

import { FtpClient } from "@logements/src/extraction/infrastructure/gateway/client/studapart/ftp.client";
import { StreamZipClient } from "@logements/src/extraction/infrastructure/gateway/client/studapart/stream-zip.client";

import { DateService } from "@shared/src/domain/service/date.service";
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
	imports: [ConfigModule.forRoot()],
	providers: [
		{
			provide: "AssainisseurDeTexte",
			useValue: new HtmlToMarkdownSanitizer(new TurndownService()),
		},
		{
			provide: "AxiosInstance",
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
