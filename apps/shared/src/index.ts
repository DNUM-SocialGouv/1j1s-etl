import { Client } from "minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { DateService } from "@shared/src/date.service";
import { JsonContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import {
	FileSystemClient,
	NodeFileSystemClient,
} from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [ConfigModule.forRoot()],
	providers: [
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
		DateService,
		JsonContentParser,
		{
			provide: "FileSystemClient",
			inject: [ConfigService],
			useFactory: (configService: ConfigService): FileSystemClient => {
				return new NodeFileSystemClient(configService.get<string>("TEMPORARY_DIRECTORY_PATH"));
			},
		},
		{
			provide: "UuidGenerator",
			useValue: new NodeUuidGenerator(),
		},
	],
	exports: [DateService, JsonContentParser, "FileSystemClient", Client, "UuidGenerator"],
})
export class Shared {
	private static toBoolean(value: string): boolean {
		return value.trim().toLowerCase() === "true";
	}
}
