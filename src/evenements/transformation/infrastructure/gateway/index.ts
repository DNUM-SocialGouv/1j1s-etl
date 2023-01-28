import { Client } from "minio";
import { EvenementsRepository } from "@evenements/transformation/domain/service/evenements.repository";

export type GatewayContainer = {
	minioClient: Client
	evenementsRepository: EvenementsRepository
}
