import { Client } from "minio";
import { EvenementsRepository } from "@evenements/src/transformation/domain/service/evenements.repository";

export type GatewayContainer = {
	minioClient: Client
	evenementsRepository: EvenementsRepository
}
