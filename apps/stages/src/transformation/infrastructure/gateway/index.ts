import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { XMLParser } from "fast-xml-parser";
import { Client } from "minio";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { ContentParser, XmlContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

import { Configuration, ConfigurationFactory } from "@stages/src/transformation/configuration/configuration";
import { StagesTransformationLoggerStrategy } from "@stages/src/transformation/configuration/logger-strategy";
import {
	MinioOffreDeStageRepository,
} from "@stages/src/transformation/infrastructure/gateway/repository/minio-offre-de-stage.repository";

@Module({
	imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }), Shared],
	providers: [
		{
			provide: "LoggerStrategy",
			inject: [ConfigService],
			useFactory: (configurationService: ConfigService): StagesTransformationLoggerStrategy => {
				return new StagesTransformationLoggerStrategy(configurationService.get<Configuration>("stagesTransformation"));
			},
		},
		{
			provide: "ContentParser",
			useValue: new XmlContentParser(new XMLParser({ trimValues: true })),
		},
		{
			provide: "OffreDeStageRepository",
			inject: [ConfigService, Client, "FileSystemClient", "UuidGenerator", "ContentParser", DateService, "LoggerStrategy"],
			useFactory: (
				configurationService: ConfigService,
				minioClient: Client,
				fileSystemClient: FileSystemClient,
				uuidGenerator: UuidGenerator,
				contentParser: ContentParser,
				dateService: DateService,
				loggerStrategy: LoggerStrategy,
			): MinioOffreDeStageRepository => {
				return new MinioOffreDeStageRepository(
					configurationService.get<Configuration>("stagesTransformation"),
					minioClient,
					fileSystemClient,
					uuidGenerator,
					contentParser,
					dateService,
					loggerStrategy,
				);
			},
		},
	],
	exports: ["OffreDeStageRepository"],
})
export class Gateways {
}
