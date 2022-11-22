import axios from "axios";
import {Client} from "minio";
import {Configuration} from "@evenements/extraction/configuration/configuration";
import {LoggerStrategy} from "@shared/configuration/logger";
import {NodeFileSystemClient} from "@shared/infrastructure/gateway/common/node-file-system.client";
import {NodeUuidGenerator} from "@shared/infrastructure/gateway/common/uuid.generator";
import {GatewayContainer} from "@evenements/extraction/infrastucture/gateway";
import {
	MinioHttpFlowRepository,
} from "@evenements/extraction/infrastucture/gateway/repository/minio-http-flow.repository";
import {
	TousMobilisesBasicFlowHttpClient,
} from "@evenements/extraction/infrastucture/gateway/client/tous-mobilises-basic-flow-http.client";

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

		const eventsBasicFlowHttpClient = new TousMobilisesBasicFlowHttpClient(httpClient, configuration);

		return {
			repositories: {
				flowRepository: new MinioHttpFlowRepository(
					configuration,
					minioClient,
					fileSystemClient,
					uuidGenerator,
					eventsBasicFlowHttpClient,
					loggerStrategy
				),
			},
		};
	}
}
