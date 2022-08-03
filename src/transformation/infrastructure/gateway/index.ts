import { Client } from "minio";

import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";
import {
	ContentParser,
} from "@transformation/infrastructure/gateway/xml-content.parser";
import { Pays } from "@shared/pays";
import { StorageRepository } from "@shared/gateway/storage.repository";

export type GatewayContainer = {
	country: Pays
	contentParser: ContentParser
	minioClient: Client
	storageRepository: StorageRepository
	textSanitizer: AssainisseurDeTexte
}
