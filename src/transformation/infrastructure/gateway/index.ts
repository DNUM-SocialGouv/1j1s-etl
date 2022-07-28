import { StorageClient } from "@shared/gateway/storage.client";
import { XmlContentParserRepository } from "@transformation/infrastructure/gateway/repository/xml-content-parser.repository";

export type GatewayContainer = {
	repositories: {
		fluxRepository: XmlContentParserRepository
	};
	storages: {
		storageClient: StorageClient
	};
}
