import { Client } from "minio";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";

import { Configuration } from "@configuration/configuration";
import { CountryToIso } from "@transformation/infrastructure/gateway/country-to-iso";
import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@transformation/infrastructure/gateway/html-to-markdown.sanitizer";
import { MinioOffreDeStageRepository } from "@transformation/infrastructure/gateway/repository/minio-offre-de-stage.repository";
import { NodeFileSystemClient } from "@transformation/infrastructure/gateway/node-file-system.client";
import { NodeUuidGenerator } from "@transformation/infrastructure/gateway/uuid.generator";
import { XmlContentParser } from "@transformation/infrastructure/gateway/xml-content.parser";

export class GatewayContainerFactory {
	static create(configuration: Configuration): GatewayContainer {
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO_ACCESS_KEY,
			secretKey: configuration.MINIO_SECRET_KEY,
			port: configuration.MINIO_PORT,
			endPoint: configuration.MINIO_URL,
		});
		const uuidClient = new NodeUuidGenerator();
		const xmlParser = new XMLParser({ trimValues: true });
		const contentParserRepository = new XmlContentParser(xmlParser);
		const htmlToMarkdown = new TurndownService();
		const assainisseurDeTexte = new HtmlToMarkdownSanitizer(htmlToMarkdown);

		return {
			country: new CountryToIso(),
			contentParser: contentParserRepository,
			minioClient,
			offreDeStageRepository: new MinioOffreDeStageRepository(configuration, minioClient, fileSystemClient, uuidClient, contentParserRepository),
			textSanitizer: assainisseurDeTexte,
		};
	}
}
