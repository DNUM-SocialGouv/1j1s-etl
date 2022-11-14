import { Client } from "minio";

import { AssainisseurDeTexte } from "@stages/transformation/domain/assainisseur-de-texte";
import { ContentParser } from "@stages/transformation/infrastructure/gateway/xml-content.parser";
import { OffreDeStageRepository } from "@stages/transformation/domain/offre-de-stage.repository";
import { Pays } from "@shared/pays";

export type GatewayContainer = {
	country: Pays
	contentParser: ContentParser
	minioClient: Client
	offreDeStageRepository: OffreDeStageRepository
	textSanitizer: AssainisseurDeTexte
}
