import { Client } from "minio";

import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { ContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { Pays } from "@shared/src/pays";

import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";

export type GatewayContainer = {
	country: Pays
	contentParser: ContentParser
	minioClient: Client
	offreDeStageRepository: OffreDeStageRepository
	textSanitizer: AssainisseurDeTexte
}
