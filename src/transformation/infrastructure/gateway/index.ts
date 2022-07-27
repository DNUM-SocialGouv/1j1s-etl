import { StorageClient } from "@shared/gateway/storage.client";
import { XmlFluxRepository } from "@transformation/infrastructure/gateway/repository/xml-flux.repository";

export type GatewayContainer = {
	repositories: {
		fluxRepository: XmlFluxRepository
	};
	storages: {
		storageClient: StorageClient
	};
}
