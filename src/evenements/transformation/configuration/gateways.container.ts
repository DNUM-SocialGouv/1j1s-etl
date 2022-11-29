import { Client } from "minio";

import { Configuration } from "@evenements/transformation/configuration/configuration";
import { DateService } from "@shared/date.service";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/uuid.generator";
import { JsonContentParser } from "@shared/infrastructure/gateway/content.parser";
import { GatewayContainer } from "@evenements/transformation/infrastructure/gateway";
import {
	MinioEvenementRepository,
} from "@evenements/transformation/infrastructure/gateway/repository/minio-evenement.repository";
import { EvenementsTransformationLoggerStrategy } from "@evenements/transformation/configuration/logger-strategy";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: EvenementsTransformationLoggerStrategy): GatewayContainer {
		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});

		const uuidClient = new NodeUuidGenerator();
		const dateService = new DateService();

		return {
			minioClient,
			evenementsRepository: new MinioEvenementRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidClient,
				dateService,
				loggerStrategy,
				new JsonContentParser()
			),
		};
	}
}
