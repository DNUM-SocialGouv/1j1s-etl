import { Client } from "minio";

import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";
import {
	ContentParserRepository,
} from "@transformation/infrastructure/gateway/repository/xml-content-parser.repository";
import { ConvertisseurPays } from "@shared/convertisseur-pays";
import { StorageClient } from "@shared/gateway/storage.client";

export type GatewayContainer = {
	repositories: {
		contentParserRepository: ContentParserRepository,
		country: ConvertisseurPays
		textSanitizer: AssainisseurDeTexte
	};
	storages: {
		minioClient: Client
		storageClient: StorageClient
	};
}
