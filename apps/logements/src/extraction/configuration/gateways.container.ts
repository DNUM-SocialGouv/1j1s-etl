import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Axios, AxiosInstance } from "axios";
import { Client } from "minio";

import { Configuration, ConfigurationFactory } from "@logements/src/extraction/configuration/configuration";
import { LogementsExtractionLoggerStrategy } from "@logements/src/extraction/configuration/logger.strategy";
import { FluxRepository } from "@logements/src/extraction/domain/service/flux.repository";
import {
	HousingBasicFlowHttpClient,
} from "@logements/src/extraction/infrastructure/gateway/client/housing-basic-flow-http.client";
import {
	HousingsOnFlowNameStrategy,
} from "@logements/src/extraction/infrastructure/gateway/client/housing-on-flow-name.strategy";
import { FtpClient } from "@logements/src/extraction/infrastructure/gateway/client/studapart/ftp.client";
import { StreamZipClient } from "@logements/src/extraction/infrastructure/gateway/client/studapart/stream-zip.client";
import {
	StudapartFtpFlowClient,
} from "@logements/src/extraction/infrastructure/gateway/client/studapart/studapart-ftp-flow.client";
import {
	MinioHttpFlowRepository,
} from "@logements/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository";

import { Shared } from "@shared/src";
import { LoggerStrategy } from "@shared/src/configuration/logger";
import { FlowStrategy } from "@shared/src/infrastructure/gateway/client/flow.strategy";
import { FileSystemClient } from "@shared/src/infrastructure/gateway/common/node-file-system.client";
import { UuidGenerator } from "@shared/src/infrastructure/gateway/uuid.generator";

@Module({
	imports: [ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }), Shared],
	providers: [{
		provide: HousingBasicFlowHttpClient,
		inject: [Axios],
		useFactory: (axiosInstance: AxiosInstance): HousingBasicFlowHttpClient => new HousingBasicFlowHttpClient(axiosInstance),
	}, {
		provide: StudapartFtpFlowClient,
		inject: [ConfigService, FtpClient, StreamZipClient, "FileSystemClient"],
		useFactory: (
			configurationService: ConfigService,
			ftpClient: FtpClient,
			streamZipClient: StreamZipClient,
			fileSystemClient: FileSystemClient,
		): StudapartFtpFlowClient => {
			const configuration = configurationService.get<Configuration>("extractionLogements");
			return new StudapartFtpFlowClient(configuration, ftpClient, streamZipClient, fileSystemClient);
		},
	}, {
		provide: "FlowStrategy",
		inject: [ConfigService, HousingBasicFlowHttpClient, StudapartFtpFlowClient],
		useFactory: (
			configurationService: ConfigService,
			housingBasicFlowClient: HousingBasicFlowHttpClient,
			studapartFlowClient: StudapartFtpFlowClient,
		): FlowStrategy => {
			const configuration = configurationService.get<Configuration>("extractionLogements");
			return new HousingsOnFlowNameStrategy(configuration, housingBasicFlowClient, studapartFlowClient);
		},
	}, {
		provide: LogementsExtractionLoggerStrategy,
		inject: [ConfigService],
		useFactory: (configurationService: ConfigService): LogementsExtractionLoggerStrategy => {
			return new LogementsExtractionLoggerStrategy(configurationService.get<Configuration>("extractionLogements"));
		},
	}, {
		provide: "FluxRepository",
		inject: [ConfigService, Client, "FileSystemClient", "UuidGenerator", "FlowStrategy", LogementsExtractionLoggerStrategy],
		useFactory: (
			configurationService: ConfigService,
			minioClient: Client,
			fileSystemClient: FileSystemClient,
			uuidGenerator: UuidGenerator,
			flowStrategy: FlowStrategy,
			loggerStrategy: LoggerStrategy,
		): FluxRepository => {
			const configuration = configurationService.get<Configuration>("extractionLogements");
			return new MinioHttpFlowRepository(
				configuration,
				minioClient,
				fileSystemClient,
				uuidGenerator,
				flowStrategy,
				loggerStrategy,
			);
		},
	}],
	exports: ["FluxRepository"],
})
export class Gateways {
}
