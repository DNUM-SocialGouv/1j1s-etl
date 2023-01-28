import { AnnonceDeLogementRepository } from "@logements/transformation/domain/service/annonce-de-logement.repository";
import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { Client } from "minio";

export type GatewayContainer = {
	minioClient: Client
	annonceDeLogementRepository: AnnonceDeLogementRepository
	textSanitizer: AssainisseurDeTexte
}
