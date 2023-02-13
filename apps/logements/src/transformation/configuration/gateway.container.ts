import { Client } from "minio";
import TurndownService from "turndown";

import {
	AnnonceDeLogementContentParserStrategy, StudapartOptionXmlParser,
} from "@logements/src/transformation/infrastructure/gateway/repository/annonce-de-logement-content-parser.strategy";
import { Configuration } from "@logements/src/transformation/configuration/configuration";
import { DateService } from "@shared/src/date.service";
import { GatewayContainer } from "@logements/src/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/src/infrastructure/gateway/html-to-markdown.sanitizer";
import { JsonContentParser, XmlContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { LogementsTransformationLoggerStrategy } from "@logements/src/transformation/configuration/logger-strategy";
import {
	MinioAnnonceDeLogementRepository,
} from "@logements/src/transformation/infrastructure/gateway/repository/minio-annonce-de-logement.repository";
import { NodeFileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";
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
