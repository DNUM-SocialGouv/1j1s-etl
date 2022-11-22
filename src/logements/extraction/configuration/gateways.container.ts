import { Configuration } from "@logements/extraction/configuration/configuration";
import { LoggerStrategy } from "@shared/configuration/logger";
import { GatewayContainer } from "@logements/extraction/infrastructure/gateway";
import axios from "axios";
import { NodeFileSystemClient } from "@shared/infrastructure/gateway/common/node-file-system.client";
import { Client } from "minio";
import { NodeUuidGenerator } from "@shared/infrastructure/gateway/common/uuid.generator";
import { HousingsOnFlowNameStrategy } from "@logements/extraction/infrastructure/gateway/client/flow.strategy";
import {
	MinioHttpFlowRepository,
} from "@logements/extraction/infrastructure/gateway/repository/minio-http-flow.repository";
import { HousingBasicflowClient } from "@logements/extraction/infrastructure/gateway/client/housing-basicflow.client";

export class GatewayContainerFactory {
	public static create(configuration: Configuration, loggerStrategy: LoggerStrategy): GatewayContainer {
		const httpClient = axios.create({
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
		});

		const fileSystemClient = new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH);
		const minioClient = new Client({
			accessKey: configuration.MINIO.ACCESS_KEY,
			secretKey: configuration.MINIO.SECRET_KEY,
			port: configuration.MINIO.PORT,
			endPoint: configuration.MINIO.URL,
		});
		const uuidGenerator = new NodeUuidGenerator();

		const housingBasicflowClient = new HousingBasicflowClient(httpClient);

		const flowStrategy = new HousingsOnFlowNameStrategy(configuration, housingBasicflowClient);

		return {
			repositories: {
				flowRepository: new MinioHttpFlowRepository(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator,
					flowStrategy,
					loggerStrategy,
				),
			},
		};
	}
}
