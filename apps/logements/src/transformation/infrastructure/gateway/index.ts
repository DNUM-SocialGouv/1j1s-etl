import { Client } from "minio";

import { AnnonceDeLogementRepository } from "@logements/src/transformation/domain/service/annonce-de-logement.repository";

import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";

export type GatewayContainer = {
	annonceDeLogementRepository: AnnonceDeLogementRepository
	minioClient: Client
	textSanitizer: AssainisseurDeTexte
}
