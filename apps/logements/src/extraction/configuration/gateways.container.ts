import axios from "axios";
import { Client } from "minio";

import { Configuration } from "@logements/src/extraction/configuration/configuration";
import { GatewayContainer } from "@logements/src/extraction/infrastructure/gateway";
import { HousingBasicFlowHttpClient } from "@logements/src/extraction/infrastructure/gateway/client/housing-basic-flow-http.client";
import { HousingsOnFlowNameStrategy } from "@logements/src/extraction/infrastructure/gateway/client/housing-on-flow-name.strategy";
import { FtpClient } from "@logements/src/extraction/infrastructure/gateway/client/studapart/ftp.client";
import { StreamZipClient } from "@logements/src/extraction/infrastructure/gateway/client/studapart/stream-zip.client";
import {
	StudapartFtpFlowClient,
} from "@logements/src/extraction/infrastructure/gateway/client/studapart/studapart-ftp-flow.client";
import {
	MinioHttpFlowRepository,
} from "@logements/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

import { LoggerStrategy } from "@shared/src/configuration/logger";
import { NodeFileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { NodeUuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

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

		const housingBasicflowClient = new HousingBasicFlowHttpClient(httpClient);

		const studapartFlowClient = new StudapartFtpFlowClient(configuration, new FtpClient(), new StreamZipClient(), new NodeFileSystemClient(configuration.TEMPORARY_DIRECTORY_PATH));

		const flowStrategy = new HousingsOnFlowNameStrategy(configuration, housingBasicflowClient, studapartFlowClient);

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
