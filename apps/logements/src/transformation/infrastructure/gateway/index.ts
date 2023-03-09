import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { XMLParser } from "fast-xml-parser";
import { Client } from "minio";

import {
	AnnonceDeLogementRepository,
} from "@logements/src/transformation/domain/service/annonce-de-logement.repository";
import { Configuration, ConfigurationFactory } from "@logements/src/transformation/infrastructure/configuration/configuration";
import { LogementsTransformationLoggerStrategy } from "@logements/src/transformation/infrastructure/configuration/logger-strategy";
import {
	AnnonceDeLogementContentParserStrategy,
	StudapartOptionXmlParser,
} from "@logements/src/transformation/infrastructure/gateway/repository/annonce-de-logement-content-parser.strategy";
import {
	MinioAnnonceDeLogementRepository,
} from "@logements/src/transformation/infrastructure/gateway/repository/minio-annonce-de-logement.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";
import { LoggerStrategy } from "@shared/src/infrastructure/configuration/logger";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import {
	ContentParserStrategy,
	JsonContentParser,
	XmlContentParser,
} from "@shared/src/infrastructure/gateway/content.parser";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Shared,
	],
	providers: [{
		provide: "LoggerStrategy",
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): LoggerStrategy => {
			return new LogementsTransformationLoggerStrategy(configurationService.get<Configuration>("transformationLogements"));
		},
	}, {
		provide: "ContentParserStrategy",
		inject: [JsonContentParser],
		useFactory: (jsonContentParser: JsonContentParser): AnnonceDeLogementContentParserStrategy => {
			return new AnnonceDeLogementContentParserStrategy(
				new XmlContentParser(new XMLParser({
					trimValues: true,
					isArray: StudapartOptionXmlParser.consideTagAsArray,
				})),
				jsonContentParser,
			);
		},
	}, {
		provide: "AnnonceDeLogementRepository",
		inject: [
			ConfigService,
			Client,
			"UuidGenerator",
			"FileSystemClient",
			DateService,
			"LoggerStrategy",
			"ContentParserStrategy",
		],
		useFactory: (
			configurationService: ConfigService,
			minioClient: Client,
			uuidGenerator: UuidGenerator,
			fileSystemClient: FileSystemClient,
			dateService: DateService,
			loggerStrategy: LoggerStrategy,
			contentParserStrategy: ContentParserStrategy,
		): AnnonceDeLogementRepository => {
			return new MinioAnnonceDeLogementRepository(
				configurationService.get<Configuration>("transformationLogements"),
				minioClient,
				uuidGenerator,
				fileSystemClient,
				dateService,
				loggerStrategy,
				contentParserStrategy,
			);
		},
	}],
	exports: ["AnnonceDeLogementRepository"],
})
export class Gateways {
}
