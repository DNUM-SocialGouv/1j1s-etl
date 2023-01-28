import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { Client } from "minio";
import { ContentParser } from "@shared/infrastructure/gateway/content.parser";
import { OffreDeStageRepository } from "@stages/transformation/domain/service/offre-de-stage.repository";
import { Pays } from "@shared/pays";

export type GatewayContainer = {
	country: Pays
	contentParser: ContentParser
	minioClient: Client
	offreDeStageRepository: OffreDeStageRepository
	textSanitizer: AssainisseurDeTexte
}
