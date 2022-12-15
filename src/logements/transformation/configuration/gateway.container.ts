import TurndownService from "turndown";

import { Client } from "minio";
import { Configuration } from "@logements/transformation/configuration/configuration";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@logements/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import { LogementsTransformationLoggerStrategy } from "@logements/transformation/configuration/logger-strategy";
import {
	MinioAnnonceDeLogementRepository,
} from "@logements/transformation/infrastructure/gateway/repository/minio-annonce-de-logement.repository";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";
import { JsonContentParser, XmlContentParser } from "@shared/infrastructure/gateway/content.parser";
import {
	AnnonceDeLogementContentParserStrategy, StudapartOptionXmlParser,
} from "@logements/transformation/infrastructure/gateway/repository/annonce-de-logement-content-parser.strategy";
import { XMLParser } from "fast-xml-parser";

export class GatewayContainerFactory {
	public static create(configuration: Configuration): GatewayContainer {
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const htmlToMarkdown = new TurndownService();
		const assainisseurDeTexte = new HtmlToMarkdownSanitizer(htmlToMarkdown);
		const uuidGenerator = new NodeUuidGenerator();
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const dateService = new DateService();
		const loggerStrategy = new LogementsTransformationLoggerStrategy(configuration);
		const contentParserStrategy = new AnnonceDeLogementContentParserStrategy(
			new XmlContentParser(new XMLParser({ trimValues: true, isArray: StudapartOptionXmlParser.consideTagAsArray })),
			new JsonContentParser()
		);

		return {
			minioClient,
			annonceDeLogementRepository: new MinioAnnonceDeLogementRepository(
				configuration,
				minioClient,
				uuidGenerator,
				fileSystemClient,
				dateService,
				loggerStrategy,
				contentParserStrategy,
			),
			textSanitizer: assainisseurDeTexte,
		};
	}
}
