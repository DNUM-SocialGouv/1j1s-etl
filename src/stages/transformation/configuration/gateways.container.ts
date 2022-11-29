import { Client } from "minio";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";

import { Configuration } from "@stages/transformation/configuration/configuration";
import { CountryToIso } from "@stages/transformation/infrastructure/gateway/country-to-iso";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@stages/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import { StagesTransformationLoggerStrategy } from "@stages/transformation/configuration/logger-strategy";
import {
	MinioOffreDeStageRepository,
} from "@stages/transformation/infrastructure/gateway/repository/minio-offre-de-stage.repository";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";
import { XmlContentParser } from "@shared/infrastructure/gateway/content.parser";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: StagesTransformationLoggerStrategy): GatewayContainer {
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const uuidClient = new NodeUuidGenerator();
		const xmlParser = new XMLParser({ trimValues: true });
		const contentParserRepository = new XmlContentParser(xmlParser);
		const htmlToMarkdown = new TurndownService();
		const assainisseurDeTexte = new HtmlToMarkdownSanitizer(htmlToMarkdown);
		const dateService = new DateService();

		return {
			country: new CountryToIso(),
			contentParser: contentParserRepository,
			minioClient,
			offreDeStageRepository: new MinioOffreDeStageRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidClient,
				contentParserRepository,
				dateService,
				loggerStrategy,
			),
			textSanitizer: assainisseurDeTexte,
		};
	}
}
