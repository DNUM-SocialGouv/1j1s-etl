import { Client } from "minio";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";

import { Configuration } from "@transformation/configuration/configuration";
import { CountryToIso } from "@transformation/infrastructure/gateway/country-to-iso";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@transformation/infrastructure/gateway/html-to-markdown.sanitizer";
import { MinioOffreDeStageRepository } from "@transformation/infrastructure/gateway/repository/minio-offre-de-stage.repository";
import { NodeFileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { NodeUuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";
import { XmlContentParser } from "@transformation/infrastructure/gateway/xml-content.parser";

export class GatewayContainerFactory {
	public static create(configuration: Configuration): GatewayContainer {
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
				dateService
			),
			textSanitizer: assainisseurDeTexte,
		};
	}
}
