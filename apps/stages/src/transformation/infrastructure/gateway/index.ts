import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { Client } from "minio";
import { ContentParser } from "@shared/src/infrastructure/gateway/content.parser";
import { OffreDeStageRepository } from "@stages/src/transformation/domain/service/offre-de-stage.repository";
import { Pays } from "@shared/src/pays";

export type GatewayContainer = {
	country: Pays
	contentParser: ContentParser
	minioClient: Client
	offreDeStageRepository: OffreDeStageRepository
	textSanitizer: AssainisseurDeTexte
}
