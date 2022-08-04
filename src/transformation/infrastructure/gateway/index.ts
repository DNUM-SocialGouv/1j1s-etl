import { Client } from "minio";

import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";
import {
	ContentParser,
} from "@transformation/infrastructure/gateway/xml-content.parser";
import { Pays } from "@shared/pays";
import { OffreDeStageRepository } from "@transformation/domain/1jeune1solution/offre-de-stage.repository";

export type GatewayContainer = {
	country: Pays
	contentParser: ContentParser
	minioClient: Client
	offreDeStageRepository: OffreDeStageRepository
	textSanitizer: AssainisseurDeTexte
}
